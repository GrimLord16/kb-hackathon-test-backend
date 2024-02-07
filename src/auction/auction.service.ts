import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auction } from './auction.schema'; // Adjust the import path as necessary
import { CreateAuctionDto } from './create-auction.dto';

@Injectable()
export class AuctionService {
  constructor(
    @InjectModel(Auction.name) private auctionModel: Model<Auction>,
  ) {}

  async findAll(): Promise<Auction[]> {
    return this.auctionModel.find().exec();
  }

  async create(createAuctionDto: CreateAuctionDto): Promise<Auction> {
    const createdAuction = new this.auctionModel(createAuctionDto);
    return createdAuction.save();
  }
}
