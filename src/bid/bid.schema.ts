import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Use the @Schema decorator to define a Mongoose schema for the Bid model
@Schema({ timestamps: true })
export class Bid extends Document {

    @Prop({ required: true })
    amount: number;
}

// Export the schema for the Bid model
export const BidSchema = SchemaFactory.createForClass(Bid);
