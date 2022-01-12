import { Module } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

@Module({
  controllers: [WalletController],
  providers: [WalletService],
  imports: [UsersModule],
})
export class WalletModule {}
