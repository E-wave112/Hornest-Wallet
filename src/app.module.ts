import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import config from '../ormconfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { UsersModule } from './users/users.module';
import { WalletModule } from './wallet/wallet.module';
import { getConnectionOptions } from 'typeorm';
const { DB_HOST, DB_PORT, DB_USERNAME, DB_DATABASE, DB_PASSWORD } = process.env;
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      cache: false,
      load: [configuration],
    }),

    // TypeOrmModule.forRootAsync({
    //   useFactory: async () =>
    //     Object.assign(await getConnectionOptions(), {
    //       autoLoadEntities: true,
    //     }),
    // }),

    // TypeOrmModule.forRoot(
    //   {
    //     type: 'postgres',
    //     host: DB_HOST,
    //     port: parseInt(DB_PORT),
    //     username: DB_USERNAME,
    //     password: DB_PASSWORD,
    //     database: DB_DATABASE,
    //     synchronize: false,
    //     entities: [],
    //     migrations: [
    //       "migration/*"
    //     ],
    //     cli: {
    //       migrationsDir: 'migration',
    //     },
    //     autoLoadEntities: true,
    //   }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: parseInt('5432'),
      username: 'ewave',
      password: 'dwave101',
      database: 'hornest',
      synchronize: true,
      entities: ['/dist/src/entity/*/.js'],
      migrations: ['/dist/src/db/migration/*.js'],
      cli: {
        migrationsDir: 'src/db/migration',
      },
      autoLoadEntities: true,
    }),
    UsersModule,
    WalletModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
