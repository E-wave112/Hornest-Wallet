import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UsersController } from './users.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './users.constants';
import { LocalStrategy } from './user.local-strategy';
import { JwtStrategy } from './user-jwt.strategy';
import { UserAuthGuard } from './user.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    User,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.SECRET_KEY,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [UsersService, LocalStrategy, JwtStrategy, UserAuthGuard],
  exports: [TypeOrmModule, UsersService, User],
  controllers: [UsersController],
})
export class UsersModule {}
