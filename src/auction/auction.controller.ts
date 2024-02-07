import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { Auction } from './auction.schema';
import { AuctionService } from './auction.service';
import { CreateAuctionDto } from './create-auction.dto';

@Controller('auction')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Get()
  findAll(): Promise<Auction[]> {
    console.log(`Finding all`); 
    return this.auctionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Auction> {
    console.log(`Finding auction by ID: ${id}`);
    return this.auctionService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateAuctionDto: CreateAuctionDto,
  ): Promise<Auction> {
    return this.auctionService.update(id, updateAuctionDto);
  }

  @Post()
  create(@Body() createAuctionDto: CreateAuctionDto): Promise<Auction> {
    return this.auctionService.create(createAuctionDto);
  }
}
