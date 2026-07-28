import { IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'a1b2c3d4...' })
  @IsString()
  token!: string;

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
}
