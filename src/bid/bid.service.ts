import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bid } from './bid.schema'; // Adjust the import path as necessary
import { CreateBidDto } from './create-bid.dto';

@Injectable()
export class BidService {
  constructor(@InjectModel(Bid.name) private bidModel: Model<Bid>) {}

  async findAll(): Promise<Bid[]> {
    console.log(`Finding all`); // Log the ID received
    return this.bidModel.find().exec();
  }

  async create(createBidDto: CreateBidDto): Promise<Bid> {
    const createdBid = new this.bidModel(createBidDto);
    return createdBid.save();
  }

  async findAllForAuction(auctionId: string): Promise<Bid[]> {
    return this.bidModel.find({ auction: auctionId }).exec();
  }
}
