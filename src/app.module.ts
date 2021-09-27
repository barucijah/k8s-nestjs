import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {getConnectionToken, TypeOrmModule} from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {Connection} from "typeorm";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        type: 'postgres' as 'postgres',
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: AppService,
      useFactory: (albumsConnection: Connection) => {
        return new AppService(albumsConnection);
      },
      inject: [getConnectionToken()],
    }
  ],
})
export class AppModule {}
