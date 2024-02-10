import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  pictureUrl: string;

  @Prop()
  emailVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
