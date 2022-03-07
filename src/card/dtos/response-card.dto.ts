import { Expose } from 'class-transformer';

export class CardDto {
  @Expose()
  bank: string;

  @Expose()
  cardExpiration: string;

  @Expose()
  accountNumber: string;

  @Expose()
  pin: string;
}
