import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './category.shema';
import { CreateCategoryDto } from './dtos/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const createdCategory = new this.categoryModel(createCategoryDto);

    const category = await createdCategory.save();

    return this.findById(category.id);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  async findById(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new Error(`Category with ID "${id}" not found`);
    }
    return category;
  }

  async deleteById(
    id: string,
  ): Promise<{ deleted: boolean; message?: string }> {
    try {
      const result = await this.categoryModel.deleteOne({ _id: id }).exec();
      if (result.deletedCount === 0) {
        return { deleted: false, message: 'No category found with this ID.' };
      }
      return { deleted: true };
    } catch (error) {
      throw new Error(`Failed to delete the category: ${error.message}`);
    }
  }
}
