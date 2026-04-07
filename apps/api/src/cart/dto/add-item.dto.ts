import { IsUUID, IsInt, IsOptional, Min } from 'class-validator';

export class AddItemDto {
  @IsUUID()
  variantId!: string;

  @IsUUID()
  @IsOptional()
  designId?: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}
