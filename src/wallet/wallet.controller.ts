import { Controller, Get, HttpException, Post } from '@nestjs/common';
import { UserAuthGuard } from '../users/user.guard';
import { WalletService } from './wallet.service';
import { UseGuards } from '@nestjs/common';
import { Request } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Controller('wallets')
export class WalletController {
  constructor(
    private walletService: WalletService,
    private userService: UsersService,
  ) {}

  @UseGuards(UserAuthGuard)
  @Post('user/fund-wallet')
  async fundWallet(@Request() req) {
    // get the user card details from the req.user object

    const card = await this.userService.cardDecryption(req.user.card);
    const cardCvv = await this.userService.cardDecryption(req.user.cardCvv);
    // const walletRepository = getRepository(Wallet)
    // const wallet = await walletRepository.findOne({where:{user:req.user}})
    const wallet = await this.walletService.checkIfWalletExists({
      where: { user: req.user.id },
    });
    if (!wallet) throw new HttpException('wallet not found', 404);
    wallet.balance = wallet.balance + Number(req.body.amount);

    // get the expiry year and month from the req.user object
    const [month, year] = req.user.cardExpiration.split('/');
    const payloadObj = {
      card_number: card,
      cvv: cardCvv,
      expiry_month: month,
      expiry_year: year,
      currency: 'NGN',
      amount: req.body.amount,
      fullname: `${req.user.firstName} ${req.user.lastName}`,
      email: req.user.email,
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
  async getWallet(@Request() req) {
    const wallet = await this.walletService.checkIfWalletExists({
      where: { user: req.user },
    });
    if (!wallet) throw new HttpException('wallet not found', 404);
    return wallet;
  }

  @UseGuards(UserAuthGuard)
  @Post('wallet/withdrawals')
  async withdrawFromWallet(@Request() req) {
    const payload = {
      tx_ref: `ref-withdraw-${Date.now()}`, //This is a unique reference, unique to the particular transaction being carried out. It is generated when it is not provided by the merchant for every transaction.
      amount: req.body.amount, //This is the amount to be charged.
      account_bank: this.walletService.getBankCode(req.body.account_bank), //This is the Bank numeric code. You can get a list of supported banks and their respective codes Here: https://developer.flutterwave.com/v3.0/reference#get-all-banks
      account_number: req.user.accountNumber,
      currency: 'NGN',
      email: req.user.email,
      fullname: `${req.user.firstName} ${req.user.lastName}`,
    };
    const wallet = await this.walletService.checkIfWalletExists({
      where: { user: req.user.id },
    });
    if (!wallet) throw new HttpException('wallet not found', 404);
    wallet.balance = wallet.balance - Number(req.body.amount);
    await wallet.save();
    return await this.walletService.flutterwaveWithdraw(payload);
  }

  @Get('price')
  async getCoin() {
    return await this.walletService.getCoinData();
  }
}
