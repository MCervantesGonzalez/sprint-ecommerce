import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Category } from '../../common/enums/category.enum';

export class CreateProductDto {
  @ApiProperty({ example: 'Taza Clásica' })
  @IsString()
  name!: string;

  @ApiProperty({ enum: Category, example: Category.TAZA })
  @Transform(({ value }) => value?.toUpperCase())
  @IsEnum(Category)
  category!: Category;

  @ApiPropertyOptional({ example: 'Taza de cerámica 11oz' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
