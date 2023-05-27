import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { getMongoDbConfig } from './config/mongo.config';

import { UserModule } from './user/user.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { GenreModule } from './genre/genre.module';
import { FileModule } from './file/file.module';
import { ActorModule } from './actor/actor.module';
import { MovieModule } from './movie/movie.module';
import { RatingModule } from './rating/rating.module';
import { TelegramService } from './telegram/telegram.service';
import { TelegramModule } from './telegram/telegram.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypegooseModule.forRootAsync({
      // imports: [ConfigModule],
      // inject: [ConfigModule],
      useFactory() {
        return {
          uri: "mongodb+srv://bobstonbobber:tmRZQ3xF3ZgggKqm@cluster0.fpkc1t9.mongodb.net/?retryWrites=true&w=majority"
        }
      },
    }),
    AuthModule,
    UserModule,
    GenreModule,
    FileModule,
    ActorModule,
    MovieModule,
    RatingModule,
    TelegramModule
  ],
  controllers: [AppController],
  providers: [AppService, TelegramService],
})
export class AppModule { }
