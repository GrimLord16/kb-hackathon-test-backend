import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { Auction } from './auction.schema';
import { AuctionService } from './auction.service';
import { CreateAuctionDto } from './dtos/create-auction.dto';
import { UpdateAuctionDto } from './dtos/update-auction.dto';

@Controller('auction')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Get()
  findAll(): Promise<Auction[]> {
    return this.auctionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Auction> {
    return this.auctionService.findOneWithBids(id);
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
