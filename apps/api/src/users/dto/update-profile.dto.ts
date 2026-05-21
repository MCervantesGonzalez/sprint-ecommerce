import { IsString, IsOptional, IsEmail } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Miguel Cervantes' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: '5630506063' })
  @IsString()
  @IsOptional()
  phone?: string;
}
