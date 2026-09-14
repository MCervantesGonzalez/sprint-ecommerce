import {
  IsString,
  IsEmail,
  IsOptional,
  IsArray,
  ValidateNested,
  IsUUID,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class GuestCartItemDto {
  @ApiProperty({ example: 'a1b2c3d4-...' })
  @IsUUID()
  variantId!: string;

  @ApiPropertyOptional({ example: 'a1b2c3d4-...' })
  @IsUUID()
  @IsOptional()
  designId?: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateGuestOrderDto {
  @ApiProperty({ example: 'invitado@example.com' })
  @IsEmail()
  guest_email!: string;

  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  guest_name!: string;

  @ApiPropertyOptional({ example: '3311223344' })
  @IsString()
  @IsOptional()
  guest_phone?: string;

  @ApiProperty({
    example: 'Av. Chapultepec 4563, Guadalajara, Jalisco, CP 44160',
  })
  @IsString()
  shipping_address!: string;

  @ApiProperty({ type: [GuestCartItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GuestCartItemDto)
  items!: GuestCartItemDto[];
}
