import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum } from 'class-validator';
import { Category } from '@prisma/client';

export class CreateEditorDto {
  @ApiProperty({
    example: 'Editor One',
    description: 'Editor full name',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    example: ['PROGRAMMING', 'AI'],
    description: 'Editor categories',
  })
  @IsArray()
  @IsEnum(Category, { each: true })
  categories!: Category[];

  @ApiProperty({
    example: 'editor@test.com',
    description: 'Editor email',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '12345678',
    description: 'Editor password (min 6 characters)',
  })
  @IsString()
  @MinLength(6)
  password!: string;
}
