import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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

  async findById(id: string): Promise<Auction> {
    const auction = await this.auctionModel
      .findById(id)
      .populate('createdBy')
      .exec();
    if (!auction) {
      throw new Error(`Auction with ID ${id} not found`);
    }
    return auction;
  }

  async findAllWithFilters(filters: any): Promise<Auction[]> {
    let query = this.auctionModel.find();

    if (filters.category) {
      query = query.where('product.category').equals(filters.category);
    }

    if (filters.name !== undefined) {
      query = query.where('product.name', new RegExp(filters.name, 'i'));
    }

    if (filters.charity !== undefined) {
      query = query.where('charity').equals(filters.charity);
    }

    if (filters.currency !== undefined) {
      query = query.where('currency').equals(filters.currency);
    }

    if (filters.createdBy !== undefined) {
      let users = (query = query.where('createdBy').equals(filters.createdBy));
    }

    if (filters.orderBy) {
      const sortOrder = filters.orderBy.startsWith('-') ? 'desc' : 'asc';
      const fieldName = filters.orderBy.startsWith('-')
        ? filters.orderBy.substring(1)
        : filters.orderBy;
      query = query.sort({ [fieldName]: sortOrder });
    }

    return query.exec();
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

  async findByUser(userId: string): Promise<Auction[]> {
    return this.auctionModel
      .find({ createdBy: userId })
      .populate('createdBy')
      .exec();
  }

  async create(
    createAuctionDto: CreateAuctionDto,
    userId: string,
  ): Promise<Auction> {
    const createdAuction = new this.auctionModel({
      ...createAuctionDto,
      createdBy: userId,
    });

    const auction = await createdAuction.save();

    return this.findById(auction.id);
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
