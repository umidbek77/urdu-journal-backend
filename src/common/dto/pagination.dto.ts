import { IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {

  @ApiPropertyOptional({
    example: 1,
    description: 'Page number',
    default: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  @ApiPropertyOptional({
    example: 15,
    description: 'Items per page',
    default: 15
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number = 15;

}