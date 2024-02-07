import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Auction } from './auction.schema'; // Adjust the import path as necessary
import { CreateAuctionDto } from './create-auction.dto';

@Injectable()
export class AuctionService {
  constructor(
    @InjectModel(Auction.name) private auctionModel: Model<Auction>,
  ) {}

  async findAll(): Promise<Auction[]> {
    console.log(`Finding all`); // Log the ID received
    return this.auctionModel.find().exec();
  }

  async findOne(id: string): Promise<Auction> {
    console.log(`Finding auction by ID: ${id}`); // Log the ID received
    const auction = await this.auctionModel.findById(id).exec();
    console.log(auction); // Log the found auction
    if (!auction) {
      throw new Error(`Auction with ID ${id} not found`);
    }
    return auction;
  }

  async findOneWithBids(id: string): Promise<any> {
    // Renamed method for fetching an auction with its bids using aggregation
    const result = await this.auctionModel
      .aggregate([
        { $match: { _id: new Types.ObjectId(id) } },
        {
          $lookup: {
            from: 'bids', // the collection name for bids in MongoDB
            localField: '_id',
            foreignField: 'auction',
            as: 'bids',
          },
        },
      ])
      .exec();

    if (!result || result.length === 0) {
      throw new Error(`Auction with ID ${id} not found`);
    }

    return result[0]; // Since aggregate returns an array, we return the first element.
  }

  async create(createAuctionDto: CreateAuctionDto): Promise<Auction> {
    const createdAuction = new this.auctionModel(createAuctionDto);
    return createdAuction.save();
  }

  async update(
    id: string,
    updateAuctionDto: CreateAuctionDto,
  ): Promise<Auction> {
    const updatedAuction = await this.auctionModel
      .findByIdAndUpdate(id, updateAuctionDto, { new: true })
      .exec();
    if (!updatedAuction) {
      throw new Error(`Auction with ID ${id} not found`);
    }
    return updatedAuction;
  }
}
