import { Module } from '@nestjs/common';
import { AuctionController } from './auction.controller';
import { AuctionService } from './auction.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Auction, AuctionSchema } from './auction.schema';
import { CategoryModule } from 'src/category/category.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Auction.name, schema: AuctionSchema }]),
    CategoryModule,
    UserModule
  ],
  providers: [AuctionService],
  controllers: [AuctionController],
  exports: [
    MongooseModule.forFeature([{ name: Auction.name, schema: AuctionSchema }]),
  ],
})
export class AuctionModule {}
