import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './schema/category.schema';
import { CreateCategoryDto } from './DTO/create-category.dto';
import slugify from 'slugify';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const slug = slugify(createCategoryDto.name, { lower: true });
    const category = new this.categoryModel({
      ...createCategoryDto,
      slug
    });
    return category.save();
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  async findBySlug(slug: string): Promise<Category> {
    return this.categoryModel.findOne({ slug }).exec();
  }

  async findOne(id: string): Promise<Category> {
    return this.categoryModel.findById(id).exec();
  }

  async findByName(name: string): Promise<Category> {
    const normalizedName = name.toLowerCase().replace(/[&\s]+/g, '');
    return this.categoryModel.findOne({ 
      name: { $regex: new RegExp(normalizedName, 'i') } 
    }).exec();
  }

  async update(id: string, updateCategoryDto: CreateCategoryDto): Promise<Category> {
    const slug = slugify(updateCategoryDto.name, { lower: true });
    const updated = await this.categoryModel
      .findByIdAndUpdate(id, { ...updateCategoryDto, slug }, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException('Category not found');
    }
    return updated;
  }

  async delete(id: string): Promise<Category> {
    const deleted = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('Category not found');
    }
    return deleted;
  }
}