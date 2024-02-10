import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuctionModule } from './auction/auction.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BidModule } from './bid/bid.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuctionModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI ?? '', {
      dbName: 'kbh-test',
    }),
    BidModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
