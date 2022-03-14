import { Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { UsersService } from 'src/users/users.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class SchedulerService {
  constructor(
    private mailService: MailService,
    private userService: UsersService,
    private walletService: WalletService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async sendPriceAlertToUsers() {
    const query = {
      where: { priceAlert: true },
    };
    const users = await this.userService.findAll(query);
    const prices = await this.walletService.getCoinPrice();

    await this.mailService.sendMultipleEmail('price_alert', users, prices);
  }

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async sendCoinPricePredictionToUsers() {
    const query = {
      where: { pricePrediction: true },
    };

    const today = new Date();
    const date =
      today.getFullYear() +
      '-' +
      (today.getMonth() + 1) +
      '-' +
      today.getDate();
    const users = await this.userService.findAll(query);
    const prices = await this.walletService.predictPrice({
      date_entered: date,
    });
    await this.mailService.sendMultipleEmail('price_prediction', users, prices);
  }
}
