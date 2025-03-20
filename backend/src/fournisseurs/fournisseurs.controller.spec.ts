import { Test, TestingModule } from '@nestjs/testing';
import { FournisseursController } from './fournisseurs.controller';
import { FournisseursService } from './fournisseurs.service';
import { S3Service } from '../s3/s3.service';
import { CreatefournisseurDTO } from './dto/create-fournisseur.dto';
import { UpdatefournisseurDTO } from './dto/update-fournisseur.dto';
import { BadRequestException } from '@nestjs/common';

// Mocks des services
const mockFournisseursService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findByCategory: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockS3Service = {
  uploadFile: jest.fn(),
};

// Données de test
const mockFournisseur = {
  _id: 'test-id',
  name: 'Fournisseur Test',
  description: 'Description Test',
  category: 'category-id',
  logo: 'logo-url',
};

const mockFile = {
  fieldname: 'logo',
  originalname: 'test-image.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  buffer: Buffer.from('test file content'),
  size: 1024,
} as Express.Multer.File;

describe('FournisseursController', () => {
  let controller: FournisseursController;
  let fournisseursService: FournisseursService;
  let s3Service: S3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FournisseursController],
      providers: [
        { provide: FournisseursService, useValue: mockFournisseursService },
        { provide: S3Service, useValue: mockS3Service },
      ],
    }).compile();

    controller = module.get<FournisseursController>(FournisseursController);
    fournisseursService = module.get<FournisseursService>(FournisseursService);
    s3Service = module.get<S3Service>(S3Service);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createFournisseurDto: CreatefournisseurDTO = {
      name: 'Fournisseur Test',
      description: 'Description Test',
      category: 'category-id',
    };

    it('should create a fournisseur with file upload', async () => {
      const fileUrl = 'https://s3-bucket/fournisseurs/image.jpg';
      mockS3Service.uploadFile.mockResolvedValue(fileUrl);
      mockFournisseursService.create.mockResolvedValue({
        ...mockFournisseur,
        logo: fileUrl,
      });

      const result = await controller.create(mockFile, createFournisseurDto);

      expect(s3Service.uploadFile).toHaveBeenCalledWith(mockFile, expect.stringContaining('fournisseurs/'));
      expect(fournisseursService.create).toHaveBeenCalledWith({
        ...createFournisseurDto,
        logo: fileUrl,
      });
      expect(result.logo).toBe(fileUrl);
    });

    it('should create a fournisseur without file upload', async () => {
      mockFournisseursService.create.mockResolvedValue({
        ...mockFournisseur,
        logo: null,
      });

      const result = await controller.create(null, createFournisseurDto);

      expect(s3Service.uploadFile).not.toHaveBeenCalled();
      expect(fournisseursService.create).toHaveBeenCalledWith({
        ...createFournisseurDto,
        logo: null,
      });
      expect(result.logo).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all fournisseurs when no categoryId provided', async () => {
      const mockFournisseurs = [mockFournisseur];
      mockFournisseursService.findAll.mockResolvedValue(mockFournisseurs);

      const result = await controller.findAll();

      expect(fournisseursService.findAll).toHaveBeenCalled();
      expect(fournisseursService.findByCategory).not.toHaveBeenCalled();
      expect(result).toEqual(mockFournisseurs);
    });

    it('should return fournisseurs filtered by category when categoryId provided', async () => {
      const categoryId = 'category-id';
      const mockFournisseurs = [mockFournisseur];
      mockFournisseursService.findByCategory.mockResolvedValue(mockFournisseurs);

      const result = await controller.findAll(categoryId);

      expect(fournisseursService.findByCategory).toHaveBeenCalledWith(categoryId);
      expect(fournisseursService.findAll).not.toHaveBeenCalled();
      expect(result).toEqual(mockFournisseurs);
    });
  });

  describe('findOne', () => {
    it('should return a single fournisseur by id', async () => {
      const id = 'test-id';
      mockFournisseursService.findOne.mockResolvedValue(mockFournisseur);

      const result = await controller.findOne(id);

      expect(fournisseursService.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockFournisseur);
    });
  });

  describe('update', () => {
    const updateFournisseurDto: UpdatefournisseurDTO = {
      name: 'Updated Fournisseur',
      description: 'Updated Description',
    };

    it('should update a fournisseur with file upload', async () => {
      const id = 'test-id';
      const fileUrl = 'https://s3-bucket/fournisseurs/updated-image.jpg';
      mockS3Service.uploadFile.mockResolvedValue(fileUrl);
      mockFournisseursService.update.mockResolvedValue({
        ...mockFournisseur,
        ...updateFournisseurDto,
        logo: fileUrl,
      });

      const result = await controller.update(id, updateFournisseurDto, mockFile);

      expect(s3Service.uploadFile).toHaveBeenCalledWith(mockFile, expect.stringContaining('fournisseurs/'));
      expect(fournisseursService.update).toHaveBeenCalledWith(id, {
        ...updateFournisseurDto,
        logo: fileUrl,
      });
      expect(result.name).toBe(updateFournisseurDto.name);
      expect(result.logo).toBe(fileUrl);
    });

    it('should update a fournisseur without file upload', async () => {
      const id = 'test-id';
      mockFournisseursService.update.mockResolvedValue({
        ...mockFournisseur,
        ...updateFournisseurDto,
      });

      const result = await controller.update(id, updateFournisseurDto, null);

      expect(s3Service.uploadFile).not.toHaveBeenCalled();
      expect(fournisseursService.update).toHaveBeenCalledWith(id, updateFournisseurDto);
      expect(result.name).toBe(updateFournisseurDto.name);
    });

    it('should throw BadRequestException when id is missing', async () => {
      await expect(controller.update('', updateFournisseurDto, null)).rejects.toThrow(BadRequestException);
      expect(fournisseursService.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a fournisseur by id', async () => {
      const id = 'test-id';
      mockFournisseursService.delete.mockResolvedValue(mockFournisseur);

      const result = await controller.delete(id);

      expect(fournisseursService.delete).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockFournisseur);
    });
  });
});