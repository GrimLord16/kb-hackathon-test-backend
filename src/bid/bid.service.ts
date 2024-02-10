import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bid } from './bid.schema'; // Adjust the import path as necessary
import { CreateBidDto } from './dtos/create-bid.dto';
import { Auction } from 'src/auction/auction.schema';

@Injectable()
export class BidService {
  constructor(
    @InjectModel(Bid.name) private bidModel: Model<Bid>,
    @InjectModel(Auction.name) private auctionModel: Model<Auction>, // Inject the auction model as well
  ) {}

  async create(createBidDto: CreateBidDto, userId: string): Promise<Bid> {
    const createdBid = new this.bidModel({
      ...createBidDto,
      createdBy: userId, // Assign the userId to the createdBy field
    });

    const bid = await createdBid.save();

    await this.auctionModel.findByIdAndUpdate(
      createBidDto.auction,
      { $push: { bids: bid._id } },
      { new: true, useFindAndModify: false },
    );

    return this.findById(bid.id);
  }

  async findAll(): Promise<Bid[]> {
    return this.bidModel.find().exec();
  }

  async findByUser(userId: string): Promise<Bid[]> {
    return this.bidModel
      .find({ createdBy: userId })
      .populate('createdBy')
      .exec();
  }

  async findById(bidId: string): Promise<Bid> {
    const bid = await this.bidModel
      .findById(bidId)
      .populate('createdBy')
      .exec();
    if (!bid) {
      throw new Error(`Bid with ID '${bidId}' not found`);
    }
    return bid;
  }
}
