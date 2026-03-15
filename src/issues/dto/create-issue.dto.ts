import { IsInt } from 'class-validator';

export class CreateIssueDto {
  @IsInt()
  volume: number;

  @IsInt()
  number: number;

  @IsInt()
  year: number;
}