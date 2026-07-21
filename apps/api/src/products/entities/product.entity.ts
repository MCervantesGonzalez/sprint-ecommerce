import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Category } from '../../common/enums/category.enum';
import { ProductVariant } from './product-variant.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'enum', enum: Category })
  category!: Category;

  @Column({ nullable: true })
  description!: string;

  @Column({ default: false })
  featured!: boolean;

  @Column({ default: true })
  active!: boolean;

  @Column({ nullable: true })
  image_url!: string;

  @Column({ nullable: true })
  public_id!: string;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => ProductVariant, (variant) => variant.product, {
    cascade: true,
  })
  variants!: ProductVariant[];
}
