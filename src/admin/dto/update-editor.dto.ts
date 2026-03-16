import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEditorDto {

  @ApiPropertyOptional({
    example: 'Updated Editor Name',
    description: 'Editor name'
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'updatededitor@test.com',
    description: 'Editor email'
  })
  @IsOptional()
  @IsString()
  email?: string;

}