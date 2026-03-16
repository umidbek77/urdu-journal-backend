import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {

  @ApiProperty({
    example: '12345678',
    description: 'Current password'
  })
  @IsString()
  oldPassword: string;

  @ApiProperty({
    example: 'newStrongPassword123',
    description: 'New password'
  })
  @IsString()
  newPassword: string;

}