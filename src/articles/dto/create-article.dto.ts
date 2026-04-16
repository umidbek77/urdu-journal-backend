import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDto {
  @ApiProperty({
    example: 'Artificial Intelligence in Education',
    description: 'Article title',
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    example:
      'This article discusses the impact of AI in modern education systems.',
    description: 'Article abstract',
  })
  @IsString()
  @IsNotEmpty()
  abstract!: string;

  @ApiProperty({
    example: 'AI, education, machine learning',
    description: 'Article keywords',
  })
  @IsString()
  @IsNotEmpty()
  keywords!: string;

  @ApiProperty({
    example: 'https://your-storage.com/articles/article.pdf',
    description: 'Uploaded article file URL',
  })
  @IsString()
  @IsNotEmpty()
  fileUrl!: string;
}