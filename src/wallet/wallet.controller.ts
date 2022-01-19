import {
  Controller,
  Get,
  HttpException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { getRepository } from 'typeorm';
import {
  IncompleteFinancialDetailsExceptions,
  WalletNotFoundException,
} from '../exceptions';
import { UserDecorator } from '../users/decorators/user.decorator';
import { UserAuthGuard } from '../users/guards/user.guard';
import { UsersService } from '../users/users.service';
import { Wallet } from './entities/wallet.entity';
import { WalletService } from './wallet.service';

@ApiTags('Wallet')
@Controller('wallets')
export class WalletController {
  constructor(
    private walletService: WalletService,
    private userService: UsersService,
  ) {}

  @UseGuards(UserAuthGuard)
  @Post('user/fund-wallet')
  async fundWallet(@Request() req, @UserDecorator() user: any) {
    // get the user card details from the req.user object

    if (!user.card || !user.cardCvv || !user.cardExpiration)
      throw new IncompleteFinancialDetailsExceptions();

    const card = await this.userService.cardDecryption(user.card);
    const cardCvv = await this.userService.cardDecryption(user.cardCvv);

    const walletRepo = getRepository(Wallet);
    const wallet = await walletRepo.findOne({
      where: { user: { id: user.id } },
    });

    if (!wallet) throw new WalletNotFoundException();
    wallet.balance = wallet.balance + Number(req.body.amount);

    // get the expiry year and month from the req.user object
    const [month, year] = user.cardExpiration.split('/');
    const payloadObj = {
      card_number: card,
      cvv: cardCvv,
      expiry_month: month,
      expiry_year: year,
      currency: 'NGN',
      amount: req.body.amount,
      fullname: `${user.firstName} ${user.lastName}`,
      email: user.email,
      enckey: 'FLWSECK_TEST437a39a29cca',
      tx_ref: `ref-card-${Date.now()}`, // This is a unique reference, unique to the particular transaction being carried out. It is generated when it is not provided by the merchant for every transaction.
      authorization: {},
      pin: req.body.pin,
      otp: req.body.otp,
    };
    await wallet.save();
    return await this.walletService.flutterwaveCharge(payloadObj);
  }

  @Get()
  async allWallets(@Request() req) {
    return await this.walletService.getAllWallets();
  }

  @UseGuards(UserAuthGuard)
  @Get('user/wallet')
  async getWallet(@Request() req, @UserDecorator() user: any) {
    const walletRepo = getRepository(Wallet);

    console.log(user);
    const wallet = await walletRepo.findOne({
      where: { user: { id: user.id } },
    });
    if (!wallet) throw new WalletNotFoundException();
    return wallet;
  }

  @UseGuards(UserAuthGuard)
  @Post('wallet/withdrawals')
  async withdrawFromWallet(@Request() req, @UserDecorator() user: any) {
    if (!user.accountNumber) throw new IncompleteFinancialDetailsExceptions();
    const payload = {
      tx_ref: `ref-withdraw-${Date.now()}`, //This is a unique reference, unique to the particular transaction being carried out. It is generated when it is not provided by the merchant for every transaction.
      amount: req.body.amount, //This is the amount to be charged.
      account_bank: this.walletService.getBankCode(req.body.account_bank), //This is the Bank numeric code. You can get a list of supported banks and their respective codes Here: https://developer.flutterwave.com/v3.0/reference#get-all-banks
      account_number: user.accountNumber,
      currency: 'NGN',
      email: user.email,
      fullname: `${user.firstName} ${user.lastName}`,
    };
    const walletRepo = getRepository(Wallet);

    const wallet = await walletRepo.findOne({
      where: { user: { id: user.id } },
    });
    if (!wallet) throw new WalletNotFoundException();
    // check if the amount is greater than the balance by more than the minimum wallet balance
    const funds = this.walletService.checkSufficientFunds(
      Number(req.body.amount),
      wallet,
    );
    if (!funds)
      throw new HttpException(
        'insufficient funds you must have at least NGN100 in your wallet',
        400,
      );
    wallet.balance = wallet.balance - Number(req.body.amount);
    await wallet.save();
    return await this.walletService.flutterwaveWithdraw(payload);
  }

  @Get('price')
  async getCoin() {
    return await this.walletService.getCoinData();
  }
}
