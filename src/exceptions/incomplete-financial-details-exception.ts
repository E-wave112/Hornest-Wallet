import { BadRequestException } from '@nestjs/common';
export class IncompleteFinancialDetailsExceptions extends BadRequestException {
  constructor(error?: string) {
    super(
      'your financial details are not complete, please update your profile!',
      error,
    );
  }
}
