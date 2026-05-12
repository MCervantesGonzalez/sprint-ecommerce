import { IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DesignCategory } from 'src/common/enums/design-category.enum';

export class CreateDesignDto {
  @ApiProperty({ example: 'Diseño Floral' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: 'Patrón floral minimalista' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: DesignCategory, example: DesignCategory.FLORAL })
  @IsEnum(DesignCategory)
  @IsOptional()
  category?: DesignCategory;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
