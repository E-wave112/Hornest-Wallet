import { HttpException, Injectable } from '@nestjs/common';
import { User } from './users.entity';
import { getRepository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { emailRegex, jwtConstants } from './users.constants';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { userInfo } from 'os';
const algorithm: string = 'aes-256-cbc';

const randomIv = crypto.randomBytes(16);

@Injectable()
export class UsersService {
  constructor(private jwtService: JwtService) {}
  async findUser(email: string, password: string): Promise<User | string> {
    let UserRepository = getRepository(User);
    const singleUser = await UserRepository.findOne({
      where: { email: email },
    });
    console.log(singleUser);
    if (!singleUser) {
      throw new HttpException('User not found', 404);
    }
    if (!emailRegex.test(email)) {
      throw new HttpException('Invalid email address', 400);
    }
    const validPassword = await bcrypt.compare(password, singleUser.password);
    if (!singleUser || !validPassword) {
      throw new HttpException('Incorrect credentials!', 401);
    }
    return singleUser;
  }

  async cardTokenization(obj: any) {
    try {
      const cipher = crypto.createCipheriv(
        algorithm,
        jwtConstants.ENCRYPTION_KEY,
        randomIv,
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
        jwtConstants.ENCRYPTION_KEY,
        randomIv,
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

  async viewUser(id: any) {
    try {
      let UserRepository = getRepository(User);
      const singleUser = await UserRepository.findOne(id);
      if (!singleUser) {
        throw new HttpException('User not found', 404);
      }
     
      return singleUser;
 
    } catch (err: any) {
      console.error(err.message);
      throw new HttpException(err.message, 500);
    }
  }

  async register(user: any) {
    let UserRepository = getRepository(User);
    const { firstName, lastName, email, password } = user;
    const existingUser = await UserRepository.findOne({
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
    return { message: 'user created successfully', savedUser };
  }

  async login(obj: any) {
    try {
      let UserRepository = getRepository(User);
      let user = await UserRepository.findOne({ where: { email: obj.email } });
      console.log(user);
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

  async updateUser(id: any, user: any) {
    try {
      let UserRepository = getRepository(User);
      let singleUser = await UserRepository.findOne(id);
      if (user.card) {
        user.card = await this.cardTokenization(user.card);
      }
      if (user.cardCvv) {
        user.cardCvv = await this.cardTokenization(user.cardCvv);
      }

      let updatedUser = await UserRepository.save({
        id: singleUser.id,
        ...user,
      });

      return { message: 'user updated successfully', updatedUser };
    } catch (err: any) {
      console.error(err.message);
      throw new HttpException(err.message, 500);
    }
  }
}
