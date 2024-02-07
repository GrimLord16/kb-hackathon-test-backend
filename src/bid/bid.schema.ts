import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Auction } from '../auction/auction.schema';

// Use the @Schema decorator to define a Mongoose schema for the Bid model
@Schema({ timestamps: true })
export class Bid extends Document {
  @Prop({ required: true })
  amount: number;

  @Prop({ type: Types.ObjectId, ref: 'Auction', required: true })
  auction: Auction | Types.ObjectId;
}

// Export the schema for the Bid model
export const BidSchema = SchemaFactory.createForClass(Bid);
