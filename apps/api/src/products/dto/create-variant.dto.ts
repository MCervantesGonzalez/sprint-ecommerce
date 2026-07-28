import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVariantDto {
  @ApiProperty({ example: '11oz' })
  @IsString()
  size!: string;

  @ApiProperty({ example: 'Blanco' })
  @IsString()
  color!: string;

  @ApiProperty({ example: 50 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stock!: number;

  @ApiProperty({ example: 150.0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  base_price!: number;

  @ApiPropertyOptional({ example: true })
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @ApiPropertyOptional({
    example: 200.0,
    description: 'Precio original antes de oferta ',
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(0)
  compare_price?: number;
}
