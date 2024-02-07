import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Auction } from './auction.schema';
import { AuctionService } from './auction.service';
import { CreateAuctionDto } from './create-auction.dto';

@Controller('auction')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Get()
  findAll(): Promise<Auction[]> {
    return this.auctionService.findAll();
  }

  @Post()
  create(@Body() createAuctionDto: CreateAuctionDto): Promise<Auction> {
    return this.auctionService.create(createAuctionDto);
  }
}
