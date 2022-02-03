import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { UsersModule } from './users/users.module';
import { WalletModule } from './wallet/wallet.module';
import { ConfigService } from '@nestjs/config';
import { TransactionsModule } from './transactions/transactions.module';
// instantiate a new config service class for the case of the db_uri
const configService: ConfigService = new ConfigService(configuration);
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      cache: false,
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      port: parseInt('5432'),
      url: configService.get<string>('DB_URI'),
      synchronize: true,
      entities: [],
      migrations: [],
      cli: {
        migrationsDir: 'migrations',
      },
      autoLoadEntities: true,
    }),
    UsersModule,
    WalletModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
