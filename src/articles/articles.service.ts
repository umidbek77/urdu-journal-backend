import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { ReviewArticleDto } from './dto/review-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    private supabaseService: SupabaseService,
    private prisma: PrismaService,
  ) {}

  async uploadArticle(file: Express.Multer.File) {
    const supabase = this.supabaseService.getClient();

    const fileName = `${Date.now()}-${file.originalname}`;

    const { error } = await supabase.storage
      .from('articles')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      throw new Error(error.message);
    }

    const { data: publicUrl } = supabase.storage
      .from('articles')
      .getPublicUrl(fileName);

    return publicUrl.publicUrl;
  }

  async submitArticle(userId: string, dto: CreateArticleDto) {
    const keywordsArray = dto.keywords.split(',').map((k) => k.trim());

    return this.prisma.article.create({
      data: {
        title: dto.title,
        abstract: dto.abstract,
        keywords: keywordsArray,
        fileUrl: dto.fileUrl,
        authorId: userId,
      },
    });
  }

  async getMyArticles(userId: string) {
    return this.prisma.article.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        feedback: true,
        reviewFileUrl: true,
        paymentReceiptUrl: true,
      },
    });
  }

  async getSubmittedArticles() {
    return this.prisma.article.findMany({
      where: {
        status: 'SUBMITTED',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.article.update({
      where: {
        id: id,
      },
      data: {
        status: status as any,
      },
    });
  }

  async reviewArticle(
    articleId: string,
    editorId: string,
    dto: ReviewArticleDto,
    file?: Express.Multer.File,
  ) {
    let reviewFileUrl: string | null = null;

    if (file) {
      if (file.mimetype !== 'application/pdf') {
        throw new Error('Only PDF allowed');
      }

      const supabase = this.supabaseService.getClient();

      const fileName = `review-${Date.now()}-${file.originalname}`;

      const { error } = await supabase.storage
        .from('reviews')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
        });

      if (error) throw new Error(error.message);

      const { data } = supabase.storage.from('reviews').getPublicUrl(fileName);

      reviewFileUrl = data.publicUrl;
    }

    return this.prisma.article.update({
      where: { id: articleId },
      data: {
        status: dto.status,
        feedback: dto.feedback,
        editorId,
        reviewFileUrl,
      },
    });
  }

  async uploadPayment(articleId: string, file: Express.Multer.File) {
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article || article.status !== 'ACCEPTED') {
      throw new Error('Only accepted articles can upload payment');
    }

    const supabase = this.supabaseService.getClient();

    const fileName = `payment-${Date.now()}-${file.originalname}`;

    const { error } = await supabase.storage
      .from('payments')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) throw new Error(error.message);

    const { data } = supabase.storage.from('payments').getPublicUrl(fileName);

    return this.prisma.article.update({
      where: { id: articleId },
      data: {
        paymentReceiptUrl: data.publicUrl,
      },
    });
  }

  async publishArticle(articleId: string, issueId: string) {
    return this.prisma.article.update({
      where: {
        id: articleId,
      },
      data: {
        status: 'PUBLISHED',
        issueId: issueId,
      },
    });
  }

  async editorDashboard(editorId: string) {
    const assigned = await this.prisma.article.count({
      where: {
        editorId: editorId,
      },
    });

    const underReview = await this.prisma.article.count({
      where: {
        editorId: editorId,
        status: 'UNDER_REVIEW',
      },
    });

    const accepted = await this.prisma.article.count({
      where: {
        editorId: editorId,
        status: 'ACCEPTED',
      },
    });

    const rejected = await this.prisma.article.count({
      where: {
        editorId: editorId,
        status: 'REJECTED',
      },
    });

    return {
      assigned,
      underReview,
      accepted,
      rejected,
    };
  }

  async editorArticles() {
    return this.prisma.article.findMany({
      where: {
        status: {
          in: ['SUBMITTED', 'UNDER_REVIEW', 'REVISION'],
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            affiliation: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getArticleDetail(id: string) {
    return this.prisma.article.findUnique({
      where: {
        id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            affiliation: true,
          },
        },
      },
    });
  }

  async authorDashboard(userId: string) {
    const submitted = await this.prisma.article.count({
      where: {
        authorId: userId,
        status: 'SUBMITTED',
      },
    });

    const underReview = await this.prisma.article.count({
      where: {
        authorId: userId,
        status: 'UNDER_REVIEW',
      },
    });

    const accepted = await this.prisma.article.count({
      where: {
        authorId: userId,
        status: 'ACCEPTED',
      },
    });

    const rejected = await this.prisma.article.count({
      where: {
        authorId: userId,
        status: 'REJECTED',
      },
    });

    const published = await this.prisma.article.count({
      where: {
        authorId: userId,
        status: 'PUBLISHED',
      },
    });

    const total = await this.prisma.article.count({
      where: {
        authorId: userId,
      },
    });

    return {
      submitted,
      underReview,
      accepted,
      rejected,
      published,
      total,
    };
  }

  async downloadArticle(id: string) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      select: {
        fileUrl: true,
        title: true,
      },
    });

    if (!article) {
      throw new Error('Article not found');
    }

    return article;
  }

  async acceptedArticles() {
    return this.prisma.article.findMany({
      where: {
        status: 'ACCEPTED',
      },
      include: {
        author: true,
        editor: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
