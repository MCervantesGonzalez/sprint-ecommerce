import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ nullable: true })
  label!: string;

  @Column()
  street!: string;

  @Column({ nullable: true })
  neighborhood!: string;

  @Column()
  city!: string;

  @Column()
  state!: string;

  @Column()
  zip_code!: string;

  @Column({ default: false })
  is_default!: boolean;

  @CreateDateColumn()
  created_at!: Date;
}
