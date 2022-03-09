import { Exclude } from 'class-transformer';
import { User } from 'src/users/entities/users.entity';

import {
  Column,
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity('Card')
export class Card extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  bank: string;

  @Column({ default: '' })
  card?: string;

  @Exclude()
  @Column({ default: '' })
  cardExpiration?: string;

  @Exclude()
  @Column({ default: '' })
  cardCvv?: string;

  @Column({ default: '' })
  accountNumber?: string;

  @Column({ default: '' })
  pin?: string;

  @Column({ default: '' })
  otp?: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne((type) => User, (user) => user.cards)
  user: number;
}
