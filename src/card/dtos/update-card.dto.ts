import { IsString, IsOptional } from 'class-validator';

export class updateCardDto {
  @IsOptional()
  @IsString()
  bank: string;

  @IsOptional()
  @IsString()
  card: string;

  @IsOptional()
  @IsString()
  cardExpiration: string;

  @IsOptional()
  @IsString()
  cardCvv: string;

  @IsOptional()
  @IsString()
  accountNumber: string;

  @IsOptional()
  @IsString()
  pin: string;

  @IsOptional()
  @IsString()
  otp: string;
}
