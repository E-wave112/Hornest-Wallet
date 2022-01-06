import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UsersController } from './users.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports:[TypeOrmModule.forFeature([User]), PassportModule],
  exports:[TypeOrmModule,UsersService],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
