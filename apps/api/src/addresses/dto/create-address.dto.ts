import { IsString, IsOptional, IsBoolean, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiPropertyOptional({ example: 'Casa' })
  @IsString()
  @IsOptional()
  label?: string;

  @ApiProperty({ example: 'Av. Chapultepec 4563' })
  @IsString()
  street!: string;

  @ApiPropertyOptional({ example: 'Americana' })
  @IsString()
  @IsOptional()
  neighborhood?: string;

  @ApiProperty({ example: 'Guadalajara' })
  @IsString()
  city!: string;

  @ApiProperty({ example: 'Jalisco' })
  @IsString()
  state!: string;

  @ApiProperty({ example: '44160' })
  @IsString()
  @Length(5, 5, { message: 'El código postal debe tener 5 dígitos' })
  zip_code!: string;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  is_default?: boolean;
}
