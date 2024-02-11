import { Body, Controller, Get, Param, Delete, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.shema';
import { CreateCategoryDto } from './dtos/create-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Category> {
    return this.categoryService.findById(id);
  }

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(createCategoryDto);
  }

  @Delete(':id')
  deleteOne(
    @Param('id') id: string,
  ): Promise<{ deleted: boolean; message?: string }> {
    return this.categoryService.deleteById(id);
  }
}
