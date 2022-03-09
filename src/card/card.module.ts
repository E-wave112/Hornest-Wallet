import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { Card } from './entities/card.entities';

@Module({
  controllers: [CardController],
  providers: [CardService],
  imports: [TypeOrmModule.forFeature([Card]), UsersModule],
  exports: [CardService],
})
export class CardModule {}
