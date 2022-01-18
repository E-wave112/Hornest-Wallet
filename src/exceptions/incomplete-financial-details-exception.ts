import { BadRequestException } from '@nestjs/common';
export class IncompleteFinancialDetailsExceptions extends BadRequestException {
  constructor(error?: string) {
    super('error.incomplete.financial.details', error);
  }
}
