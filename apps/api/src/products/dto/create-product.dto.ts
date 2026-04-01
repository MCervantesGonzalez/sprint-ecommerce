import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { Category } from 'src/common/enums/category.enum';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsEnum(Category)
  category: Category;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
