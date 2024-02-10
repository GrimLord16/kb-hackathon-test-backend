import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { BidService } from './bid.service';
import { CreateBidDto } from './dtos/create-bid.dto';
import { Bid } from './bid.schema';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { Identify } from 'src/common/identify.decorator';
import { JwtUser } from 'src/lib/jwt';

@Controller('bid')
@UseGuards(JwtAuthGuard)
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @Post()
  create(@Body() createBidDto: CreateBidDto, @Identify() user: JwtUser): Promise<Bid> {
    return this.bidService.create(createBidDto, user.id);
  }

  @Get()
  findAll(@Identify() user: JwtUser): Promise<Bid[]> {
    console.log('jwt user', user);
    return this.bidService.findAll();
  }
}
