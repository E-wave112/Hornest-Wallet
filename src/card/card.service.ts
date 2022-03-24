import {
  Injectable,
  NotFoundException,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './entities/card.entities';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

const algorithm = 'aes-256-cbc';

@Injectable()
export class CardService {
  ENCRYPTION_KEY = Buffer.from(
    this.configService.get<string>('ENCRYPTION_KEY') as string,
    'hex',
  );
  secret = Buffer.from(this.configService.get<string>('RANDOM_IV'));
  randomIv = Buffer.from(
    crypto
      .createHash('sha256')
      .update(String(this.secret))
      .digest('base64')
      .substring(0, 16),
  );

  constructor(
    @InjectRepository(Card)
    private cardRepo: Repository<Card>,
    private configService: ConfigService,
  ) {}

  async create(
    userId: number,
    newCard: string,
    cardExpiration: string,
    newCvv: string,
    accountNumber: string,
    bank: string,
    // pin: string,
    // otp: string,
  ) {
    const cardExists = await this.cardRepo.find({
      where: { cardExpiration },
    });

    if (cardExists.length) throw new BadRequestException('Card already added');

    const card = await this.cardTokenization(newCard);
    const cardCvv = await this.cardTokenization(newCvv);
    const account = this.cardRepo.create({
      card,
      bank,
      cardExpiration,
      cardCvv,
      accountNumber,
      // pin,
      // otp,
    });

    account.user = userId;
    return this.cardRepo.save(account);
  }

  findOne(id: number) {
    if (!id) throw new NotFoundException('Account not found');
    const account = this.cardRepo.findOne(id);
    return account;
  }

  async findByBankName(name: string) {
    const card = await this.cardRepo.find({
      where: { bank: name },
    });

    return card[0];
  }
  find() {
    const cards = this.cardRepo.find();
    return cards;
  }

  async update(id: number, attrs: Partial<Card>) {
    const card = await this.findOne(id);
    if (!card) throw new NotFoundException('Account not found!');

    Object.assign(card, attrs);
    return this.cardRepo.save(card);
  }

  async remove(id: number) {
    const card = await this.findOne(id);
    if (!card) throw new NotFoundException('Card not found!');
    return this.cardRepo.remove(card);
  }

  async cardTokenization(obj: any) {
    try {
      const cipher = crypto.createCipheriv(
        algorithm,
        this.ENCRYPTION_KEY,
        this.randomIv,
      );
      let encrypted = cipher.update(obj, 'utf-8', 'hex');
      encrypted += cipher.final('hex');
      return encrypted;
    } catch (err: any) {
      console.error(err.message);
      throw new HttpException(err.message, 500);
    }
  }
  async cardDecryption(obj: string) {
    try {
      const decipher = crypto.createDecipheriv(
        algorithm,
        this.ENCRYPTION_KEY,
        this.randomIv,
      );
      let decrypted = decipher.update(obj, 'hex', 'utf-8');
      decrypted += decipher.final('utf-8');
      // console.log(decrypted);
      return decrypted;
    } catch (err: any) {
      console.error(err.message);
      throw new HttpException(err.message, 500);
    }
  }
}
