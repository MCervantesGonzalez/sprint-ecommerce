import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: 'Av. Chapultepec 123,  Guadalajara, Jalisco' })
  @IsString()
  shipping_address!: string;
}
