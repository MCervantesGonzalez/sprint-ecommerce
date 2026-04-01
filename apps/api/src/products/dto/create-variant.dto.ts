import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
} from 'class-validator';

export class CreateVariantDto {
  @IsString()
  size: string;

  @IsString()
  color: string;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsNumber()
  @Min(0)
  base_price: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
