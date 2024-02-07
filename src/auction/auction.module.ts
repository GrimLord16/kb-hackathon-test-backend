import { Module } from '@nestjs/common';
import { AuctionController } from './auction.controller';
import { AuctionService } from './auction.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Auction, AuctionSchema } from './auction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Auction.name, schema: AuctionSchema }]),
  ],
  controllers: [AuctionController],
  providers: [AuctionService],
})
export class AuctionModule {}
    