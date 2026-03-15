import { IsOptional, IsString } from 'class-validator';

export class UpdateEditorDto {

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

}