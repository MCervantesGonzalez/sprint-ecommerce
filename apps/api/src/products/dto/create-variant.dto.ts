import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVariantDto {
  @ApiProperty({ example: '11oz' })
  @IsString()
  size!: string;

  @ApiProperty({ example: 'Blanco' })
  @IsString()
  color!: string;

  @ApiProperty({ example: 50 })
  @IsNumber()
  @Min(0)
  stock!: number;

  @ApiProperty({ example: 150.0 })
  @IsNumber()
  @Min(0)
  base_price!: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
