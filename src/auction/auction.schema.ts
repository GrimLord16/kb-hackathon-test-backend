import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Bid } from 'src/bid/bid.schema';
import { User } from 'src/user/user.schema';
import { Category } from 'src/category/category.shema';

export type ChatDocument = HydratedDocument<Auction>;

// Define a class for the inner object 'product'
class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Category | Types.ObjectId;

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

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: User | Types.ObjectId;

  // The createdAt field is automatically managed by Mongoose with { timestamps: true } option in the @Schema decorator.
}

export const AuctionSchema = SchemaFactory.createForClass(Auction);
