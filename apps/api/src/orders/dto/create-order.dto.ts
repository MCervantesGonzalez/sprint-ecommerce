import { IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  shipping_address!: string;
}
