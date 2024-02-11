import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BidController } from './bid.controller';
import { BidService } from './bid.service';
import { Bid, BidSchema } from './bid.schema';
import { AuctionModule } from 'src/auction/auction.module';
import { BidGateway } from './bid.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bid.name, schema: BidSchema }]),
    AuctionModule,
  ],
  controllers: [BidController],
  providers: [BidService, BidGateway],
})
export class BidModule {}
