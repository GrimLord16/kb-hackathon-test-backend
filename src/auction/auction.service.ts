import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auction } from './auction.schema'; // Adjust the import path as necessary
import { CreateAuctionDto } from './dtos/create-auction.dto';
import { UpdateAuctionDto } from './dtos/update-auction.dto';
import { Category } from 'src/category/category.shema';

interface MatchStage {
  charity?: { $eq: boolean };
  currency?: { $regex: RegExp };
  'product.name'?: { $regex: RegExp };
  'product.category'?: { $in: RegExp[] };
  // Add any other fields that you might dynamically add to matchStage
}

@Injectable()
export class AuctionService {
  constructor(
    @InjectModel(Auction.name) private auctionModel: Model<Auction>,
  ) {}

  async findAll(): Promise<Auction[]> {
    return this.auctionModel.find().exec();
  }

  async findAllWithFilters(filters: any): Promise<Auction[]> {
    // Explicitly declare 'categoryIds' as an array of strings
    let categoryIds: string[] = []; // This change addresses the TypeScript errors

    // If category names are provided, fetch corresponding category IDs
    if (filters.category) {
    }

    // Build the initial query with case-insensitive matching for the product name
    let query = this.auctionModel.find();

    // Apply direct filters on Auction model fields
    if (filters.charity !== undefined) {
      query.where('charity', filters.charity === 'true' ? true : false);
    }
    if (filters.currency !== undefined) {
      query.where('currency', new RegExp(filters.currency, 'i')); // Case-insensitive match for currency
    }
    if (filters.name !== undefined) {
      query.where('product.name', { $regex: filters.name, $options: 'i' }); // Case-insensitive match for product name
    }

    // Filter by category IDs if categories were found
    if (categoryIds.length > 0) {
      query.where('product.category', { $in: categoryIds });
    }

    // Populate 'createdBy' and 'product.category'
    query = query
      .populate({
        path: 'createdBy',
        select: 'name email -_id', // Adjust fields as needed
      })
      .populate({
        path: 'product.category',
        select: 'name -_id', // Adjust fields as needed
      });

    const results = await query.exec();
    return results;
  }

  async findById(id: string): Promise<Auction> {
    const auction = await this.auctionModel
      .findById(id)
      .populate({
        path: 'product.category',
        model: 'Category',
      })
      .populate({
        path: 'bids',
        populate: {
          path: 'createdBy',
          model: 'User',
        },
      })
      .populate('createdBy', 'User')
      .exec();

    if (!auction) {
      throw new Error(`Auction with ID ${id} not found`);
    }

    return auction;
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
