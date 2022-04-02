import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/mail/mail.service';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';
import { UserNotFoundException } from '../exceptions';
import { Wallet } from '../wallet/entities/wallet.entity';
import { CreateUserDto } from './dto/create-user-dto';
import { LogInUserDto } from './dto/login-user-dto';
import { User } from './entities/users.entity';
import { Query } from 'typeorm/driver/Query';

const algorithm = 'aes-256-cbc';

@Injectable()
export class UsersService {
  emailRegex = this.configService.get('emailRegex');
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
    // @Inject(forwardRef(() => MailService))
    private mailService: MailService,
    @InjectRepository(User)
    private UserRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async findUser(email: string, password: string): Promise<User> {
    const singleUser = await this.UserRepository.findOne({
      where: { email: email },
    });
    // console.log(singleUser);
    if (!singleUser) {
      throw new UserNotFoundException();
    }
    if (!this.emailRegex.test(email)) {
      throw new HttpException('Invalid email address', 400);
    }
    const validPassword = await bcrypt.compare(password, singleUser.password);
    if (!singleUser || !validPassword) {
      throw new HttpException('Incorrect credentials!', 401);
    }
    return singleUser;
  }

  async findUserById(id: number) {
    const singleUser = await this.UserRepository.findOne(id);
    return singleUser;
  }

  async findAll(query) {
    const users = await this.UserRepository.find(query);
    return users;
  }

  async viewUser(id: any) {
    try {
      const singleUser = await this.UserRepository.findOne(id);
      if (!singleUser) {
        throw new UserNotFoundException();
      }

      return singleUser;
    } catch (err: any) {
      console.error(err.message);
      throw new HttpException(err.message, 500);
    }
  }

  async register(body: CreateUserDto) {
    const { firstName, lastName, email, password } = body;
    if (password.length < 8)
      throw new HttpException(
        'passwords must be at least eight characters',
        400,
      );
    const existingUser = await this.UserRepository.findOne({
      where: { email: email },
    });
    if (existingUser) {
      throw new HttpException('User already exists!', 409);
    }

    const newUser = User.create({
      firstName,
      lastName,
      email,
      password,
    });

    const savedUser = await newUser.save();
    // automatically create the user wallet
    const walletInstance = new Wallet();
    walletInstance.user = newUser;
    await walletInstance.save();

    await this.mailService.sendEmail('welcome', savedUser);
    return { message: 'user created successfully', savedUser, walletInstance };
  }

  async login(obj: LogInUserDto) {
    try {
      // const UserRepository = getRepository(User);
      // const user = await UserRepository.findOne({
      //   where: { email: obj.email },
      // });
      const user = await this.findUser(obj.email, obj.password);
      const payload = { sub: user.id };
      return {
        access_token: this.jwtService.sign(payload),
        message: 'Login Successful',
      };
    } catch (err) {
      console.error(err.message);
      throw new HttpException(err.message, 500);
    }
  }

  async updateUser(id: number, attrs: Partial<User>) {
    try {
      const singleUser = await this.findUserById(id);

      if (!singleUser) throw new UserNotFoundException();

      Object.assign(singleUser, attrs);
      const user = await this.UserRepository.save(singleUser);

      return user;
    } catch (err: any) {
      console.error(err.message);
      throw new HttpException(err.message, 500);
    }
  }
}
