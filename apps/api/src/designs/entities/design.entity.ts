import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProductDesign } from './product-design.entity';
import { DesignCategory } from 'src/common/enums/design-category.enum';

@Entity('designs')
export class Design {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({
    type: 'enum',
    enum: DesignCategory,
    default: DesignCategory.OTRO,
  })
  category!: DesignCategory;

  @Column({ nullable: true })
  description!: string;

  @Column()
  image_url!: string;

  @Column({ nullable: true })
  public_id!: string;

  @Column({ default: true })
  active!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => ProductDesign, (pd) => pd.design)
  productDesigns!: ProductDesign[];
}
