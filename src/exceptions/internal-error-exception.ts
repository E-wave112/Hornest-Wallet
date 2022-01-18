import { InternalServerErrorException } from '@nestjs/common';

export class InternalErrorException extends InternalServerErrorException {
  constructor(error?: string) {
    super('error.internal', error);
  }
}
