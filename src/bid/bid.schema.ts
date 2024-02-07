import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Auction } from '../auction/auction.schema';

@Schema({ timestamps: true })
export class Bid extends Document {
  @Prop({ required: true })
  amount: number;

  // not used for now
  @Prop({ type: Types.ObjectId, ref: 'Auction', required: true })
  auction: Auction | Types.ObjectId;
}

export const BidSchema = SchemaFactory.createForClass(Bid);
