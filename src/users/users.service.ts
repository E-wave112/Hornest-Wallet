import { Injectable } from '@nestjs/common';
import { User } from './users.entity';
import { getRepository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { emailRegex } from './users.constants';


@Injectable()
export class UsersService {
    async findUser(email: string, password:string): Promise<User|string> {
        let UserRepository = getRepository(User);
        const singleUser = await UserRepository.findOne({where: {email: email}});
        if (!emailRegex.test(email)) {
            throw new Error("Invalid email address")
        }
        const validPassword = await bcrypt.compare(password, singleUser.password);
        if (!singleUser || !validPassword) {
        throw new Error("Incorrect credentials!");
    }
    return singleUser;
  }

}
