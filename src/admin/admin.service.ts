import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ArticleStatus, Role } from '@prisma/client';
import { UpdateEditorDto } from './dto/update-editor.dto';
import * as bcrypt from 'bcrypt';
import { CreateEditorDto } from './dto/create-editor.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async dashboardStats() {
    const users = await this.prisma.user.count({
      where: { role: Role.USER },
    });

    const editors = await this.prisma.user.count({
      where: { role: Role.EDITOR },
    });

    const articles = await this.prisma.article.count();

    const published = await this.prisma.article.count({
      where: { status: ArticleStatus.PUBLISHED },
    });

    const pending = await this.prisma.article.count({
      where: { status: ArticleStatus.SUBMITTED },
    });

    return {
      users,
      editors,
      articles,
      published,
      pending,
    };
  }

  async getAllArticles(
    status?: string,
    category?: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (category) {
      where.category = category;
    }

    const data = await this.prisma.article.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        author: true,
        editor: true,
      },
    });

    const total = await this.prisma.article.count({ where });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async getAcceptedArticles(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const data = await this.prisma.article.findMany({
      where: {
        status: 'ACCEPTED',
      },
      skip,
      take: limit,
      include: {
        author: true,
        editor: true,
      },
    });

    const total = await this.prisma.article.count({
      where: { status: 'ACCEPTED' },
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async fullDashboard() {
    const total = await this.prisma.article.count();

    const byStatus = await this.prisma.article.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    const byCategory = await this.prisma.article.groupBy({
      by: ['category'],
      _count: { category: true },
    });

    return {
      total,
      byStatus,
      byCategory,
    };
  }

  async getEditors(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const editors = await this.prisma.user.findMany({
      where: {
        role: 'EDITOR',
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    const total = await this.prisma.user.count({
      where: {
        role: 'EDITOR',
      },
    });

    return {
      data: editors,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async createEditor(data: CreateEditorDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: Role.EDITOR,
        categories: data.categories,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        categories: true,
        createdAt: true,
      },
    });
  }

  // ✅ FIX
  async updateEditor(id: number, data: UpdateEditorDto) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  }

  // ✅ FIX
  async deleteEditor(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  // ✅ FIX
  async getEditor(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async getUsers(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const users = await this.prisma.user.findMany({
      where: {
        role: 'USER',
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        email: true,
        affiliation: true,
        createdAt: true,
      },
    });

    const total = await this.prisma.user.count({
      where: {
        role: 'USER',
      },
    });

    return {
      data: users,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async assignArticle(articleId: number, editorId: number) {
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      throw new BadRequestException('Article not found');
    }

    if (!article.category) {
      throw new BadRequestException('Article category is missing');
    }

    const editor = await this.prisma.user.findUnique({
      where: { id: editorId },
    });

    if (!editor || editor.role !== Role.EDITOR) {
      throw new BadRequestException('Invalid editor');
    }

    const articleCategory = article.category.toLowerCase();
    const editorCategories = (editor.categories || []).map((c) =>
      c.toLowerCase(),
    );

    if (!editorCategories.includes(articleCategory)) {
      throw new BadRequestException('Editor does not match article category');
    }

    return this.prisma.article.update({
      where: { id: articleId },
      data: {
        editorId,
        status: 'UNDER_REVIEW',
        assignedByAdmin: true,
      },
    });
  }

  async articleStatusStats() {
    const statuses = await this.prisma.article.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    return statuses.map((item) => ({
      status: item.status,
      count: item._count.status,
    }));
  }

  async monthlyArticles() {
    const articles = await this.prisma.article.findMany({
      select: {
        createdAt: true,
      },
    });

    const months: Record<string, number> = {};

    articles.forEach((article) => {
      const month = article.createdAt.toISOString().slice(0, 7);

      if (!months[month]) {
        months[month] = 0;
      }

      months[month]++;
    });

    return Object.keys(months).map((month) => ({
      month,
      count: months[month],
    }));
  }
}
