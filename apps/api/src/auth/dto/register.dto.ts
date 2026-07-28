import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Miguel Cervantes' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'miguel@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Passw0rd!', minLength: 8 })
  @IsString()
  @MinLength(8)
  @Matches(/[A-Z]/, {
    message: 'La contraseña debe incluir al menos una mayúscula',
  })
  @Matches(/[a-z]/, {
    message: 'La contraseña debe incluir al menos una minúscula',
  })
  @Matches(/[0-9]/, {
    message: 'La contraseña debe incluir al menos un número',
  })
  @Matches(/[^A-Za-z0-9]/, {
    message: 'La contraseña debe incluir al menos un carácter especial',
  })
  password!: string;

  @ApiPropertyOptional({ example: '3336612227' })
  @IsString()
  @IsOptional()
  phone?: string;
}
