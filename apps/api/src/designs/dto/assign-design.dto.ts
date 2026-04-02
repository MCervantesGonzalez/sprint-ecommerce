import { IsUUID, IsNumber, IsOptional, Min } from 'class-validator';

export class AssignDesignDto {
  @IsUUID()
  designId: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  extra_price?: number;
}

// Este DTO es para asignar un diseño a un producto con su `extra_price`. Lo usaremos en el endpoint `POST /api/products/:id/designs`.
