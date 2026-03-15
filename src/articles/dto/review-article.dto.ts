import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ArticleStatus } from '@prisma/client';

export class ReviewArticleDto {
  @IsEnum(ArticleStatus)
  status: ArticleStatus;

  @IsOptional()
  @IsString()
  feedback?: string;
}