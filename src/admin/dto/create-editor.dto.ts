import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEditorDto {

  @ApiProperty({
    example: 'Editor One',
    description: 'Editor full name'
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'editor@test.com',
    description: 'Editor email'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '12345678',
    description: 'Editor password (min 6 characters)'
  })
  @IsString()
  @MinLength(6)
  password: string;

}