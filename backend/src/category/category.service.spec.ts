import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './schema/category.schema';

describe('CategoryService', () => {
  let service: CategoryService;
  let model: Model<Category>;

  const mockCategory = {
    _id: 'testId',
    name: 'Test Category',
    icon: 'test-icon',
    description: 'Test Description',
    group: 'Test Group',
    order: 1,
    slug: 'test-category',
  };

  const mockCategoryModel = {
    find: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([mockCategory]) }),
    findById: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockCategory) }),
    findByIdAndUpdate: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockCategory) }),
    findByIdAndDelete: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockCategory) }),
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

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockCategory]);
      expect(mockCategoryModel.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      const result = await service.findOne('testId');
      expect(result).toEqual(mockCategory);
      expect(mockCategoryModel.findById).toHaveBeenCalledWith('testId');
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const updateCategoryDto = {
        name: 'Updated Category',
        icon: 'updated-icon',
        description: 'Updated Description',
        group: 'Updated Group',
        order: 2,
      };
      const result = await service.update('testId', updateCategoryDto);
      expect(result).toEqual(mockCategory);
      expect(mockCategoryModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'testId',
        expect.objectContaining(updateCategoryDto),
        { new: true },
      );
    });
  });

  describe('delete', () => {
    it('should delete a category', async () => {
      const result = await service.delete('testId');
      expect(result).toEqual(mockCategory);
      expect(mockCategoryModel.findByIdAndDelete).toHaveBeenCalledWith('testId');
    });
  });
});
