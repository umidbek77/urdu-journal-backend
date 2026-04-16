import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ArticleStatus } from '@prisma/client';

export class UpdateArticleStatusDto {

  @ApiProperty({
    example: 'UNDER_REVIEW',
    enum: ArticleStatus,
  })
  @IsEnum(ArticleStatus)
  status!: ArticleStatus;

}