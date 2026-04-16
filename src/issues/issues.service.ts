import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class IssuesService {
  constructor(
    private prisma: PrismaService,
    private supabaseService: SupabaseService,
  ) {}

  async createIssue(
    dto: CreateIssueDto,
    file?: Express.Multer.File,
    coverImage?: Express.Multer.File,
  ) {
    let pdfUrl: string | null = null;
    let coverImageUrl: string | null = null;

    const supabase = this.supabaseService.getClient();

    if (file) {
      const fileName = `issue-${Date.now()}-${file.originalname}`;

      const { error } = await supabase.storage
        .from('issues')
        .upload(fileName, file.buffer);

      if (error) throw new Error(error.message);

      const { data } = supabase.storage.from('issues').getPublicUrl(fileName);

      pdfUrl = data.publicUrl;
    }

    if (coverImage) {
      const imageName = `cover-${Date.now()}-${coverImage.originalname}`;

      const { error } = await supabase.storage
        .from('covers')
        .upload(imageName, coverImage.buffer, {
          contentType: coverImage.mimetype,
        });

      if (error) throw new Error(error.message);

      const { data } = supabase.storage.from('covers').getPublicUrl(imageName);

      coverImageUrl = data.publicUrl;
    }

    return this.prisma.issue.create({
      data: {
        volume: dto.volume,
        number: dto.number,
        year: dto.year,
        pdfUrl,
        coverImageUrl,
        series: dto.series,
        publishedDate: new Date(dto.publishedDate),
      },
    });
  }

  async getIssues() {
    return this.prisma.issue.findMany({
      include: {
        articles: true,
      },
    });
  }
}
