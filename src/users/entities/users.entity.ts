import { Exclude } from 'class-transformer';

import {
  Column,
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';

import * as bcrypt from 'bcryptjs';
import { IsEmail, Min } from 'class-validator';
import { Card } from 'src/card/entities/card.entities';

@Entity('User')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName?: string;

  @Column()
  lastName?: string;

  @Column({ unique: true })
  @IsEmail({ message: 'Email is not valid' })
  email: string;

  @Column()
  @Min(8, { message: 'Password must be at least 8 characters' })
  password: string;

  @OneToMany((type) => Card, (card) => card.user, {
    onDelete: 'CASCADE',
    eager: true,
  })
  cards: Card[];

  // @Column({ default: '' })
  // card?: string;

  // @Exclude()
  // @Column({ default: '' })
  // cardExpiration?: string;

  // @Exclude()
  // @Column({ default: '' })
  // cardCvv?: string;

  // @Column({ default: '' })
  // accountNumber?: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  //describe a typeorm hook to automatically hash the password before saving it to the database
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
