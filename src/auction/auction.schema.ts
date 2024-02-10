import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Bid } from 'src/bid/bid.schema';

export type ChatDocument = HydratedDocument<Auction>;

// Define a class for the inner object 'product'
class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  category: string;

  @Prop()
  pictureUrl: string;
}

@Schema({ timestamps: true })
export class Auction {
  @Prop({ type: Product, required: true })
  product: Product;

  @Prop({ type: [Types.ObjectId], ref: 'Bid', default: [] })
  bids: Bid[];

  @Prop({ required: true, default: false })
  charity: boolean;

  @Prop({ required: true })
  currency: string;
  
  // The createdAt field is automatically managed by Mongoose with { timestamps: true } option in the @Schema decorator.
}

export const AuctionSchema = SchemaFactory.createForClass(Auction);
