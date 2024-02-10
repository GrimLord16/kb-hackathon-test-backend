import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // Import MongooseModule
import { BidController } from './bid.controller';
import { BidService } from './bid.service';
import { Bid, BidSchema } from './bid.schema'; // Import your Bid schema
import { AuctionModule } from 'src/auction/auction.module';
import { BidGateway } from './bid.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bid.name, schema: BidSchema }]), // Add this line
    AuctionModule,
  ],
  controllers: [BidController],
  providers: [BidService, BidGateway],
})
export class BidModule {}
