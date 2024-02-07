import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { Auction } from './auction.schema'; // Adjust the import path as necessary
import { CreateAuctionDto } from './dtos/create-auction.dto';
import { UpdateAuctionDto } from './dtos/update-auction.dto';

@Injectable()
export class AuctionService {
  constructor(
    @InjectModel(Auction.name) private auctionModel: Model<Auction>,
  ) {}

  async findAll(): Promise<Auction[]> {
    return this.auctionModel.find().exec();
  }

  async findOne(id: string): Promise<Auction> {
    const auction = await this.auctionModel.findById(id).exec();
    if (!auction) {
      throw new Error(`Auction with ID ${id} not found`);
    }
    return auction;
  }

  async findOneWithBids(id: string): Promise<any> {
    const result = await this.auctionModel
      .aggregate()
      .match({ _id: new Types.ObjectId(id) })
      .lookup({
        from: 'bids',
        localField: 'bids',
        foreignField: '_id',
        as: 'bids',
      })
      .exec();

    if (!result || result.length === 0) {
      throw new Error(`Auction with ID ${id} not found`);
    }

    return result[0];
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

  async updatePartial(
    id: string,
    updateAuctionDto: UpdateAuctionDto, 
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
