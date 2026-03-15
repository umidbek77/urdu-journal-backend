import { Injectable } from '@nestjs/common';
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
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async updateEditor(id: string, data: UpdateEditorDto) {
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

  async deleteEditor(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async getEditor(id: string) {
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
