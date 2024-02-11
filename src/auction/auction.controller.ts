import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Auction } from './auction.schema';
import { AuctionService } from './auction.service';
import { CreateAuctionDto } from './dtos/create-auction.dto';
import { UpdateAuctionDto } from './dtos/update-auction.dto';
import { Identify } from 'src/common/identify.decorator';
import { JwtUser } from 'src/lib/jwt';
import { JwtAuthGuard } from 'src/guards/auth.guard';

@Controller('auction')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query('category') category?: string,
    @Query('name') name?: string,
    @Query('charity') charity?: boolean,
    @Query('currency') currency?: string,
    @Query('createdBy') createdBy?: number,
    @Query('orderBy') orderBy?: string,
  ): Promise<Auction[]> {
    return this.auctionService.findAllWithFilters({
      category,
      name,
      charity,
      currency,
      createdBy,
      orderBy,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Auction> {
    return this.auctionService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateAuctionDto: CreateAuctionDto,
  ): Promise<Auction> {
    return this.auctionService.update(id, updateAuctionDto);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createAuctionDto: CreateAuctionDto,
    @Identify() user: JwtUser,
  ): Promise<Auction> {
    return this.auctionService.create(createAuctionDto, user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updatePartial(
    @Param('id') id: string,
    @Body() updateAuctionDto: UpdateAuctionDto,
  ): Promise<Auction> {
    return this.auctionService.updatePartial(id, updateAuctionDto);
  }
}
