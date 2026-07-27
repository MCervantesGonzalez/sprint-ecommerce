import { IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Category } from '../../common/enums/category.enum';
import { Material } from '../../common/enums/material.enum';

export class FilterProductsDto {
  @ApiPropertyOptional({ enum: Category })
  @Transform(({ value }) => value?.toUpperCase())
  @IsOptional()
  @IsEnum(Category)
  category?: Category;

  @ApiPropertyOptional({ enum: Material })
  @Transform(({ value }) => value?.toUpperCase())
  @IsOptional()
  @IsEnum(Material)
  material?: Material;
}
