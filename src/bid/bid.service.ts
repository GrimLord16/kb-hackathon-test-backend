import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bid } from './bid.schema';
import { CreateBidDto } from './dtos/create-bid.dto';
import { Auction } from 'src/auction/auction.schema';
import { HttpStatus, HttpException } from '@nestjs/common';

@Injectable()
export class BidService {
  constructor(
    @InjectModel(Bid.name) private bidModel: Model<Bid>,
    @InjectModel(Auction.name) private auctionModel: Model<Auction>,
  ) {}

  async create(createBidDto: CreateBidDto, userId: string): Promise<Bid> {
    // Fetch the auction to check the current max bid price and min bid step
    const auction = await this.auctionModel
      .findById(createBidDto.auction)
      .exec();
    if (!auction) {
      throw new HttpException('Auction not found', HttpStatus.BAD_REQUEST);
    }

    // Check if the bid is higher than currentMaxBidPrice + minBidStep
    const minimumRequiredBid = auction.currentMaxBidPrice + auction.minBidStep;
    if (createBidDto.amount < minimumRequiredBid) {
      throw new HttpException(
        `Your bid of ${createBidDto.amount} is not sufficient. The minimum required bid is ${minimumRequiredBid}.`,
        HttpStatus.BAD_REQUEST
      );
    }

    const createdBid = new this.bidModel({
      ...createBidDto,
      createdBy: userId,
    });

    const bid = await createdBid.save();

    // Update the auction with the new bid and current max bid price
    await this.auctionModel.findByIdAndUpdate(
      createBidDto.auction,
      {
        $push: { bids: bid._id },
        $set: { currentMaxBidPrice: createBidDto.amount },
      },
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
      throw new HttpException(
        `Bid with ID '${bidId}' not found`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return bid;
  }
}
