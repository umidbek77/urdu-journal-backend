import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {

  @ApiPropertyOptional({
    example: 'Umidbek Zaripov',
    description: 'User full name'
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'Tashkent University of Information Technologies',
    description: 'User affiliation'
  })
  @IsOptional()
  @IsString()
  affiliation?: string;

}