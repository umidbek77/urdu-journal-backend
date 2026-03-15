import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIssueDto } from './dto/create-issue.dto';

@Injectable()
export class IssuesService {
  constructor(private prisma: PrismaService) {}

  async createIssue(dto: CreateIssueDto) {
    return this.prisma.issue.create({
      data: {
        volume: dto.volume,
        number: dto.number,
        year: dto.year,
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