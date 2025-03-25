import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './DTO/create-category.dto';
import { UserRole } from '../users/schema/user.schema';
import { NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';

// Mock pour AuthGuard
const mockAuthGuard = { canActivate: jest.fn(() => true) };

// Mock pour RolesGuard
const mockRolesGuard = { canActivate: jest.fn(() => true) };

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;

  // Données de test
  const mockCategory = {
    id: 'category-id-1',
    name: 'Test Category',
    description: 'Test Description',
    slug: 'test-category',
    icon: 'test-icon'
  };

  const mockCategories = [
    mockCategory,
    {
      id: 'category-id-2',
      name: 'Another Category',
      description: 'Another Description',
      slug: 'another-category',
      icon: 'another-icon'
    }
  ];

  const createCategoryDto: CreateCategoryDto = {
    name: 'New Category',
    description: 'New Description',
    icon: 'new-icon' // Ajout du champ icon obligatoire
  };

  // Mock du CategoryService
  const mockCategoryService = {
    create: jest.fn().mockResolvedValue({
      id: 'new-category-id',
      ...createCategoryDto,
      slug: 'new-category'
    }),
    findAll: jest.fn().mockResolvedValue(mockCategories),
    findOne: jest.fn().mockImplementation((id) => {
      if (id === 'category-id-1') {
        return Promise.resolve(mockCategory);
      }
      return Promise.resolve(null);
    }),
    findBySlug: jest.fn().mockImplementation((slug) => {
      if (slug === 'test-category') {
        return Promise.resolve(mockCategory);
      }
      return Promise.resolve(null);
    }),
    update: jest.fn().mockImplementation((id, dto) => {
      if (id === 'category-id-1') {
        return Promise.resolve({
          id,
          ...dto,
          slug: 'updated-category'
        });
      }
      throw new NotFoundException(`Category with ID ${id} not found`);
    }),
    delete: jest.fn().mockImplementation((id) => {
      if (id === 'category-id-1') {
        return Promise.resolve({ deleted: true });
      }
      throw new NotFoundException(`Category with ID ${id} not found`);
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: mockCategoryService
        }
      ]
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue(mockAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);

    // Réinitialiser les mocks avant chaque test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const result = await controller.create(createCategoryDto);
      
      expect(service.create).toHaveBeenCalledWith(createCategoryDto);
      expect(result).toEqual({
        id: 'new-category-id',
        name: 'New Category',
        description: 'New Description',
        icon: 'new-icon',
        slug: 'new-category'
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const result = await controller.findAll();
      
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockCategories);
      expect(result.length).toBe(2);
    });
  });

  describe('findOne', () => {
    it('should find a category by ID', async () => {
      // Simuler que findBySlug ne trouve rien pour forcer la recherche par ID
      jest.spyOn(service, 'findBySlug').mockResolvedValueOnce(null);
      
      const result = await controller.findOne('category-id-1');
      
      expect(service.findBySlug).toHaveBeenCalledWith('category-id-1');
      expect(service.findOne).toHaveBeenCalledWith('category-id-1');
      expect(result).toEqual(mockCategory);
    });
  
    it('should find a category by slug', async () => {
      const result = await controller.findOne('test-category');
      
      expect(service.findBySlug).toHaveBeenCalledWith('test-category');
      expect(service.findOne).not.toHaveBeenCalled();
      expect(result).toEqual(mockCategory);
    });
  
    it('should return the category when found by slug', async () => {
      const result = await controller.findOne('test-category');
      
      expect(service.findBySlug).toHaveBeenCalledWith('test-category');
      expect(result).toEqual(mockCategory);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const updateDto: CreateCategoryDto = { 
        name: 'Updated Category', 
        description: 'Updated Description',
        icon: 'updated-icon' // Ajout du champ icon obligatoire
      };
      
      const result = await controller.update('category-id-1', updateDto);
      
      expect(service.update).toHaveBeenCalledWith('category-id-1', updateDto);
      expect(result).toEqual({
        id: 'category-id-1',
        name: 'Updated Category',
        description: 'Updated Description',
        icon: 'updated-icon',
        slug: 'updated-category'
      });
    });

    it('should throw NotFoundException when category not found', async () => {
      const updateDto: CreateCategoryDto = { 
        name: 'Updated Category', 
        description: 'Updated Description',
        icon: 'updated-icon'
      };
      
      await expect(controller.update('nonexistent-id', updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a category', async () => {
      const result = await controller.delete('category-id-1');
      
      expect(service.delete).toHaveBeenCalledWith('category-id-1');
      expect(result).toEqual({ deleted: true });
    });

    it('should throw NotFoundException when category not found', async () => {
      await expect(controller.delete('nonexistent-id')).rejects.toThrow(NotFoundException);
    });
  });
});