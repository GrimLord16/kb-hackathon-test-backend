import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true })
  name: string;

  // The createdAt field is automatically managed by Mongoose with { timestamps: true } option in the @Schema decorator.
}

export const CategorySchema = SchemaFactory.createForClass(Category);
