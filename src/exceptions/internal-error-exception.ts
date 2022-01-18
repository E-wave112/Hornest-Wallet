import { InternalServerErrorException } from '@nestjs/common';

export class InternalErrorException extends InternalServerErrorException {
  constructor(error?: string) {
    super('network/server error!', error);
  }
}
