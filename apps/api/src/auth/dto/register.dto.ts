import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Miguel Cervantes' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'miguel@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '12345678', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiPropertyOptional({ example: '3336612227' })
  @IsString()
  @IsOptional()
  phone?: string;
}
