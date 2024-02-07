import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuctionModule } from './auction/auction.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    AuctionModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI ?? '', {
      dbName: 'khb-test',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
