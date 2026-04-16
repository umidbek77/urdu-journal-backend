import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIssueDto {
  @ApiProperty({
    example: 1,
    description: 'Journal volume',
  })
  @IsInt()
  volume!: number;

  @ApiProperty({
    example: 2,
    description: 'Issue number',
  })
  @IsInt()
  number!: number;

  @ApiProperty({
    example: 2026,
    description: 'Publication year',
  })
  @IsInt()
  year!: number;

  @ApiProperty({
    example: '2023-10-01',
    description: 'Publication date',
  })
  @IsString()
  publishedDate!: string;

  @ApiProperty({
    example: 'Series A',
    description: 'Issue series',
  })
  @IsString()
  series!: string;
}
