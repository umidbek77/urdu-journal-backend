import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import {
  Controller,
  Post,
  Patch,
  Param,
  Get,
  UploadedFile,
  UseInterceptors,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { ReviewArticleDto } from './dto/review-article.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

@Controller('articles')
export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadArticle(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only PDF or DOCX files are allowed');
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new BadRequestException('File size must be less than 10MB');
    }

    const url = await this.articlesService.uploadArticle(file);

    return {
      message: 'Article uploaded successfully',
      url,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('submit')
  async submitArticle(@Req() req, @Body() dto: CreateArticleDto) {
    return this.articlesService.submitArticle(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async myArticles(@Req() req) {
    return this.articlesService.getMyArticles(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EDITOR)
  @Get('submitted')
  async submittedArticles() {
    return this.articlesService.getSubmittedArticles();
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.articlesService.updateStatus(id, body.status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EDITOR)
  @Patch(':id/review')
  async reviewArticle(
    @Param('id') id: string,
    @Req() req,
    @Body() dto: ReviewArticleDto,
  ) {
    return this.articlesService.reviewArticle(id, req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Patch(':id/publish/:issueId')
  async publishArticle(
    @Param('id') id: string,
    @Param('issueId') issueId: string,
  ) {
    return this.articlesService.publishArticle(id, issueId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EDITOR)
  @Get('editor/dashboard')
  async editorDashboard(@Req() req) {
    return this.articlesService.editorDashboard(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EDITOR)
  @Get('editor/articles')
  async editorArticles() {
    return this.articlesService.editorArticles();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EDITOR)
  @Get('editor/articles/:id')
  async articleDetail(@Param('id') id: string) {
    return this.articlesService.getArticleDetail(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('author/dashboard')
  async authorDashboard(@Req() req) {
    return this.articlesService.authorDashboard(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/download')
  async download(@Param('id') id: string) {
    return this.articlesService.downloadArticle(id);
  }
}
