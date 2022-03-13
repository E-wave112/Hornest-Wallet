import { Module } from '@nestjs/common';
import { MailModule } from 'src/mail/mail.module';
import { UsersModule } from 'src/users/users.module';
import { WalletModule } from 'src/wallet/wallet.module';
import { SchedulerService } from './scheduler.service';

@Module({
  imports: [UsersModule, MailModule, WalletModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
