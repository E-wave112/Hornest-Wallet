import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transactions } from './entities/transactions.entity';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [TransactionsService],
  controllers: [TransactionsController],
  imports :[TypeOrmModule.forFeature([Transactions]),UsersModule],
  exports: [TransactionsService],
})


export class TransactionsModule {}
