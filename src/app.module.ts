import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      'type':'postgres',
      'host':'localhost',
      'port':5432,
      'username':'ewave',
      'password':'dwave101',
      'entities':[],
      'database':'horn-wallet',
      'synchronize':false,
      'autoLoadEntities':true,
    }),
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
