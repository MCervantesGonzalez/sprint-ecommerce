import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGuestPreferenceDto {
  @ApiProperty({ example: 'invitado@example.com' })
  @IsEmail()
  guest_email!: string;
}
