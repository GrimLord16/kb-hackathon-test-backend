import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Define a class for the inner object 'product'
class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  category: string;

  @Prop()
  pictureUrl: string;
}

// Use the @Schema decorator to define a Mongoose schema for the Auction model
@Schema({ timestamps: true })
export class Auction extends Document {
  @Prop({ type: Product, required: true })
  product: Product;

  // The createdAt field is automatically managed by Mongoose with { timestamps: true } option in the @Schema decorator.
}

// Export the schema for the Auction model
export const AuctionSchema = SchemaFactory.createForClass(Auction);
