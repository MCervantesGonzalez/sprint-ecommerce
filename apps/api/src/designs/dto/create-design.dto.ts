import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateDesignDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
