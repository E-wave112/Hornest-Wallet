import { IsEmail, IsString } from 'class-validator';

export class createCardDto {
  @IsString()
  bank: string;

  @IsString()
  card: string;

  @IsString()
  cardExpiration: string;

  @IsString()
  cardCvv: string;

  @IsString()
  accountNumber: string;

  @IsString()
  pin: string;

  @IsString()
  otp: string;
}
