import { Module } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './wallet.entity';

@Module({
  controllers: [WalletController],
  providers: [WalletService],
  imports: [UsersModule, TypeOrmModule.forFeature([Wallet])],
})
export class WalletModule {}
