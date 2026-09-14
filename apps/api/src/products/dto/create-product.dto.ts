import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Category } from '../../common/enums/category.enum';
import { Material } from '../../common/enums/material.enum';

export class CreateProductDto {
  @ApiProperty({ example: 'Taza Clásica' })
  @IsString()
  name!: string;

  @ApiProperty({ enum: Category, example: Category.TAZA })
  @Transform(({ value }) => value?.toUpperCase())
  @IsEnum(Category)
  category!: Category;

  @ApiProperty({ enum: Material, example: Material.CERAMICA })
  @Transform(({ value }) => value?.toUpperCase())
  @IsEnum(Material)
  @IsOptional()
  material?: Material;

  @ApiPropertyOptional({ example: 'Taza de cerámica 11oz' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @ApiPropertyOptional({ example: false })
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  @IsOptional()
  featured?: boolean;
}
