import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';
import { MailService } from 'src/mail/mail.service';
import { User } from './entities/users.entity';
import { UserAuthGuard } from './guards/user.guard';
import { JwtStrategy } from './user-jwt.strategy';
import { LocalStrategy } from './user.local-strategy';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    User,
    MailModule,
    // forwardRef(() => MailModule),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET_KEY'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  providers: [UsersService, LocalStrategy, JwtStrategy, UserAuthGuard],
  exports: [TypeOrmModule, UsersService, User],
  controllers: [UsersController],
})
export class UsersModule {}
