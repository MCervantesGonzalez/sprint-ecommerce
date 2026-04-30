import { IsUUID, IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddItemDto {
  @ApiProperty({ example: '2ff8cce2-d64d-4087-b0ac-5794600c8087' })
  @IsUUID()
  variantId!: string;

  @ApiPropertyOptional({ example: '3c24a01b-6094-4165-9407-af7f3c9ca05c' })
  @IsUUID()
  @IsOptional()
  designId?: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  quantity!: number;
}
