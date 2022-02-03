import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactions } from './entities/transactions.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private TransactionsRepository: Repository<Transactions>,
  ) {}
  async createTransaction(payload: object): Promise<Transactions> {
    try {
      const newTransaction: Transactions =
        this.TransactionsRepository.create(payload);
      await this.TransactionsRepository.save(newTransaction);
      return newTransaction;
    } catch (err: any) {
      console.error(err);
      throw new HttpException(err.message, 500);
    }
  }

  async viewUserTransactions(userId: object): Promise<Transactions[]> {
    try {
      const userTransactions = await this.TransactionsRepository.find(userId);
      if (!userTransactions.length) {
        throw new HttpException('No transactions found', 404);
      }
      return userTransactions;
    } catch (err: any) {
      throw new HttpException(err.message, err.status);
    }
  }

  async deleteUserTransaction(transactionId: string): Promise<Transactions> {
    try {
      const deletedTransaction = await this.TransactionsRepository.findOne(
        transactionId,
      );
      if (!deletedTransaction) {
        throw new HttpException('Transaction not found', 404);
      }
      return await this.TransactionsRepository.remove(deletedTransaction);
      // return "transaction deleted successfully!"
    } catch (err: any) {
      throw new HttpException(err.message, err.status);
    }
  }
}
