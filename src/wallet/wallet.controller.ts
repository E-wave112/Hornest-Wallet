import {
  Controller,
  Get,
  HttpException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  IncompleteFinancialDetailsExceptions,
  WalletNotFoundException,
} from '../exceptions';
import { UserDecorator } from '../users/decorators/user.decorator';
import { UserAuthGuard } from '../users/guards/user.guard';
import { UsersService } from '../users/users.service';
import { WalletService } from './wallet.service';
import { TransactionsService } from '../transactions/transactions.service';

@ApiTags('Wallet')
@Controller('wallets')
export class WalletController {
  constructor(
    private walletService: WalletService,
    private userService: UsersService,
    private transactionsService: TransactionsService,
  ) {}

  @UseGuards(UserAuthGuard)
  @Post('user/fund-wallet')
  async fundWallet(@Request() req, @UserDecorator() user: any) {
    // get the user card details from the req.user object
    const ref = `funded-${Math.floor(Math.random()*10000000 + 1)}-${user.userId}`
    const wallet = await this.walletService.checkIfWalletExists({
      where: { user: { id: user.userId } },
    });

    if (!wallet) throw new WalletNotFoundException();

    const card = await this.userService.cardDecryption(wallet.user.card);
    const cardCvv = await this.userService.cardDecryption(wallet.user.cardCvv);

    if (
      !wallet.user.card ||
      !wallet.user.cardCvv ||
      !wallet.user.cardExpiration
    )
      throw new IncompleteFinancialDetailsExceptions();

    // get the expiry year and month from the req.user object
    const [month, year] = wallet.user.cardExpiration.split('/');
    const payloadObj = {
      card_number: card,
      cvv: cardCvv,
      expiry_month: month,
      expiry_year: year,
      currency: 'NGN',
      amount: req.body.amount,
      fullname: `${wallet.user.firstName} ${wallet.user.lastName}`,
      email: wallet.user.email,
      enckey: 'FLWSECK_TEST437a39a29cca',
      tx_ref: `ref-card-${Date.now()}`, // This is a unique reference, unique to the particular transaction being carried out. It is generated when it is not provided by the merchant for every transaction.
      authorization: {},
      pin: req.body.pin,
      otp: req.body.otp,
    };

    const funded = await this.walletService.flutterwaveCharge(payloadObj);
    if (funded.status === 'success') {
      funded.message = 'transaction successful';
      wallet.balance = wallet.balance + Number(req.body.amount);
      await wallet.save();

      const transactionObj:object = {
          user:user.userId,
          amount:req.body.amount,
          type:"CREDIT",
          status:"SUCCESS",
          reference:ref
      }
      await this.transactionsService.createTransaction(transactionObj);
      return { status: funded.status, message: funded.message, wallet };
    } else {
      throw new HttpException(funded.message, 400);
    }
  }

  @Get()
  async allWallets(@Request() req) {
    return await this.walletService.getAllWallets();
  }

  @UseGuards(UserAuthGuard)
  @Get('user/wallet')
  async getWallet(@Request() req, @UserDecorator() user: any) {
    console.log(user);
    const wallet = await this.walletService.checkIfWalletExists({
      where: { user: { id: user.userId } },
    });
    if (!wallet) throw new WalletNotFoundException();
    return wallet;
  }

  @UseGuards(UserAuthGuard)
  @Post('wallet/withdrawals')
  async withdrawFromWallet(@Request() req, @UserDecorator() user: any) {

    const ref = `funded-${Math.floor(Math.random()*10000000 + 1)}-${user.userId}`

    const wallet = await this.walletService.checkIfWalletExists({
      where: { user: { id: user.userId } },
    });

    if (!wallet) throw new WalletNotFoundException();

    if (!wallet.user.accountNumber)
      throw new IncompleteFinancialDetailsExceptions();
    const payload = {
      tx_ref: `ref-withdraw-${Date.now()}`, //This is a unique reference, unique to the particular transaction being carried out. It is generated when it is not provided by the merchant for every transaction.
      amount: req.body.amount, //This is the amount to be charged.
      account_bank: this.walletService.getBankCode(req.body.account_bank), //This is the Bank numeric code. You can get a list of supported banks and their respective codes Here: https://developer.flutterwave.com/v3.0/reference#get-all-banks
      account_number: wallet.user.accountNumber,
      currency: 'NGN',
      email: wallet.user.email,
      fullname: `${wallet.user.firstName} ${wallet.user.lastName}`,
    };

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
    const withdrawal = await this.walletService.flutterwaveWithdraw(payload);
    if (withdrawal.status === 'success') {
      withdrawal.message = 'transaction successful';
      wallet.balance = wallet.balance - Number(req.body.amount);
      await wallet.save();

      const transactionObj:object = {
        user:user.userId,
        amount:req.body.amount,
        type:"DEBIT",
        status:"SUCCESS",
        reference:ref
    }
    await this.transactionsService.createTransaction(transactionObj);

      return { status: withdrawal.status, message: withdrawal.message, wallet };
    } else {
      throw new HttpException(withdrawal.message, 400);
    }
  }

  @Get('price')
  async getCoin() {
    return await this.walletService.getCoinData();
  }
}
