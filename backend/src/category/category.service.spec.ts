import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './schema/category.schema';
import { BadRequestException } from '@nestjs/common';

describe('CategoryService', () => {
  let service: CategoryService;
  let model: Model<Category>;

  const mockCategory = {
    name: 'Test Category',
    icon: 'test-icon',
    description: 'Test Description',
    group: 'Test Group',
    order: 1,
    slug: 'test-category',
    save: jest.fn(),
  };

  const mockCategoryModel = {
    create: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getModelToken(Category.name),
          useValue: mockCategoryModel,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    model = module.get<Model<Category>>(getModelToken(Category.name));
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const createCategoryDto = {
        name: 'Test Category',
        icon: 'test-icon',
        description: 'Test Description',
        group: 'Test Group',
        order: 1,
      };

      mockCategoryModel.findOne.mockResolvedValue(null);
      mockCategoryModel.create.mockResolvedValue(mockCategory);

      const result = await service.create(createCategoryDto);

      expect(result).toEqual(mockCategory);
      expect(mockCategoryModel.findOne).toHaveBeenCalledWith({ name: createCategoryDto.name });
      expect(mockCategoryModel.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException if category name already exists', async () => {
      const createCategoryDto = {
        name: 'Test Category',
        icon: 'test-icon',
        description: 'Test Description',
        group: 'Test Group',
        order: 1,
      };

      mockCategoryModel.findOne.mockResolvedValue(mockCategory);

      await expect(service.create(createCategoryDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const categories = [mockCategory];
      mockCategoryModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(categories),
      });

      const result = await service.findAll();

      expect(result).toEqual(categories);
      expect(mockCategoryModel.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      mockCategoryModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCategory),
      });

      const result = await service.findOne('testId');

      expect(result).toEqual(mockCategory);
      expect(mockCategoryModel.findById).toHaveBeenCalledWith('testId');
    });

    it('should throw BadRequestException if category not found', async () => {
      mockCategoryModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne('testId')).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const updateCategoryDto = {
        name: 'Updated Category',
        icon: 'updated-icon',
      };

      mockCategoryModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ ...mockCategory, ...updateCategoryDto }),
      });

      const result = await service.update('testId', updateCategoryDto);

      expect(result).toEqual({ ...mockCategory, ...updateCategoryDto });
      expect(mockCategoryModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'testId',
        updateCategoryDto,
        { new: true }
      );
    });
  });

  describe('delete', () => {
    it('should delete a category', async () => {
      mockCategoryModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCategory),
      });

      const result = await service.delete('testId');

      expect(result).toEqual(mockCategory);
      expect(mockCategoryModel.findByIdAndDelete).toHaveBeenCalledWith('testId');
    });
  });
});
