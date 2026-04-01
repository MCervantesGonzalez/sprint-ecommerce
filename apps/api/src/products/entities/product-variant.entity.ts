import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  size: string;

  @Column()
  color: string;

  @Column({ default: 0 })
  stock: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  base_price: number;

  @Column({ default: true })
  active: boolean;
}
