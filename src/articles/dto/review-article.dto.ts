import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ArticleStatus } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReviewArticleDto {

  @ApiProperty({
    enum: ArticleStatus,
    example: ArticleStatus.ACCEPTED,
    description: 'Article review status'
  })
  @IsEnum(ArticleStatus)
  status!: ArticleStatus;

  @ApiPropertyOptional({
    example: 'Please fix references formatting.',
    description: 'Editor feedback for the author'
  })
  @IsOptional()
  @IsString()
  feedback?: string;

}