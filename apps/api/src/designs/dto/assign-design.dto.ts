import { IsUUID, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AssignDesignDto {
  @ApiProperty({ example: '3c24a01b-6094-4165-9407-af7f3c9ca05c' })
  @IsUUID()
  designId!: string;

  @ApiPropertyOptional({ example: 20.0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  extra_price?: number;
}

// Este DTO es para asignar un diseño a un producto con su `extra_price`. Lo usaremos en el endpoint `POST /api/products/:id/designs`.
