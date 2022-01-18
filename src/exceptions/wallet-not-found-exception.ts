import { NotFoundException } from '@nestjs/common';

export class WalletNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('wallet not Found!', error);
  }
}
