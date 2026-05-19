import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Order } from '../orders/entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { ProductVariant } from '../products/entities/product-variant.entity';
import { Design } from '../designs/entities/design.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Product, Design, ProductVariant])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
