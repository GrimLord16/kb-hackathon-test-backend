import { Body, Controller, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { Auction } from './auction.schema';
import { AuctionService } from './auction.service';
import { CreateAuctionDto } from './dtos/create-auction.dto';
import { UpdateAuctionDto } from './dtos/update-auction.dto';

@Controller('auction')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('name') name?: string,
    @Query('charity') charity?: boolean,
    @Query('currency') currency?: string,
    @Query('orderBy') orderBy?: string,
  ): Promise<Auction[]> {
    return this.auctionService.findAllWithFilters({ category, name, charity, currency, orderBy });
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Auction> {
    return this.auctionService.findOneWithBids(id);
  }

  @Get('/category/:category')
  findByCategory(@Param('category') category: string): Promise<Auction[]> {
    return this.auctionService.findByCategory(category);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateAuctionDto: CreateAuctionDto,
  ): Promise<Auction> {
    return this.auctionService.update(id, updateAuctionDto);
  }

  @Patch(':id')
  updatePartial(
    @Param('id') id: string,
    @Body() updateAuctionDto: UpdateAuctionDto,
  ): Promise<Auction> {
    return this.auctionService.updatePartial(id, updateAuctionDto);
  }

  @Post()
  create(@Body() createAuctionDto: CreateAuctionDto): Promise<Auction> {
    return this.auctionService.create(createAuctionDto);
  }
}
