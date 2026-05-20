import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Design } from './entities/design.entity';
import { ProductDesign } from './entities/product-design.entity';
import { Product } from '../products/entities/product.entity';
import { DesignsService } from './designs.service';
import { DesignsController } from './designs.controller';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Design, ProductDesign, Product]),
    StorageModule,
  ],
  providers: [DesignsService],
  controllers: [DesignsController],
  exports: [DesignsService],
})
export class DesignsModule {}
