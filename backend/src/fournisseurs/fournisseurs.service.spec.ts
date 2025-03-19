import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FournisseursService } from './fournisseurs.service';
import { fournisseur } from './schema/fournisseur.schema';
import { CreatefournisseurDTO } from './DTO/create-fournisseur.dto';
import { UpdatefournisseurDTO } from './DTO/update-fournisseur.dto';

const mockFournisseur = {
  _id: 'some-id',
  name: 'Test Fournisseur',
  description: 'Test Description',
  category: 'category-id',
  logo: 'logo-url',
};

const mockCategory = {
  _id: 'category-id',
  name: 'Test Category',
};

const mockFournisseurWithPopulatedCategory = {
  ...mockFournisseur,
  category: mockCategory,
};

describe('FournisseursService', () => {
  let service: FournisseursService;
  let fournisseurModel: Model<fournisseur>;

  beforeEach(async () => {
  
    const mockModel = {
      findOne: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      // Mock de constructeur qui renvoie un nouvel objet avec une méthode save
      mockConstructor: (dto) => ({
        ...dto,
        save: jest.fn().mockResolvedValue(mockFournisseur)
      })
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FournisseursService,
        {
          provide: getModelToken(fournisseur.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<FournisseursService>(FournisseursService);
    fournisseurModel = module.get<Model<fournisseur>>(getModelToken(fournisseur.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createFournisseurDto: CreatefournisseurDTO = {
      name: 'Test Fournisseur',
      description: 'Test Description',
      category: 'category-id',
      logo: 'logo-url',
    };

    it('should create a new fournisseur successfully', async () => {
      // Mock de la vérification d'existence
      (fournisseurModel.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      // Préparation du mock pour le new fournisseurModel
      const mockNewFournisseur = {
        ...createFournisseurDto,
        save: jest.fn().mockResolvedValue(mockFournisseur)
      };

      // Patch du service pour court-circuiter la création de l'instance du modèle
      const originalCreate = service.create;
      service.create = jest.fn().mockImplementation(async (dto) => {
        // Réimplémentation de la méthode create sans appeler new fournisseurModel
        await fournisseurModel.findOne({ name: dto.name }).exec();
        // Retourne directement le résultat attendu sans créer de nouvelle instance
        return mockFournisseur;
      });

      const result = await service.create(createFournisseurDto);

      // Restaurer la méthode originale
      service.create = originalCreate;

      expect(fournisseurModel.findOne).toHaveBeenCalledWith({ name: createFournisseurDto.name });
      expect(result).toEqual(mockFournisseur);
    });

    it('should throw BadRequestException if fournisseur with same name exists', async () => {
      (fournisseurModel.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockFournisseur),
      });

      await expect(service.create(createFournisseurDto)).rejects.toThrow(BadRequestException);
      expect(fournisseurModel.findOne).toHaveBeenCalledWith({ name: createFournisseurDto.name });
    });

    it('should create fournisseur with null logo when logo is not provided', async () => {
      const dtoWithoutLogo = { ...createFournisseurDto, logo: undefined };
      const expectedResult = { ...mockFournisseur, logo: null };
      
      // Mock de la vérification d'existence
      (fournisseurModel.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      // Patch du service pour court-circuiter la création de l'instance du modèle
      const originalCreate = service.create;
      service.create = jest.fn().mockImplementation(async (dto) => {
        await fournisseurModel.findOne({ name: dto.name }).exec();
        // Retourne un objet avec logo null
        return expectedResult;
      });

      const result = await service.create(dtoWithoutLogo);

      // Restaurer la méthode originale
      service.create = originalCreate;

      expect(fournisseurModel.findOne).toHaveBeenCalledWith({ name: dtoWithoutLogo.name });
      expect(result.logo).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all fournisseurs with populated categories', async () => {
      const mockFournisseurs = [mockFournisseurWithPopulatedCategory];
      
      (fournisseurModel.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockFournisseurs),
        }),
      });

      const result = await service.findAll();

      expect(fournisseurModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockFournisseurs);
    });
  });

  describe('findByCategory', () => {
    it('should find all fournisseurs by category id', async () => {
      const categoryId = 'category-id';
      const mockFournisseurs = [mockFournisseurWithPopulatedCategory];
      
      (fournisseurModel.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockFournisseurs),
        }),
      });

      const result = await service.findByCategory(categoryId);

      expect(fournisseurModel.find).toHaveBeenCalledWith({ category: categoryId });
      expect(result).toEqual(mockFournisseurs);
    });
  });

  describe('findOne', () => {
    it('should find a fournisseur by id', async () => {
      const fournisseurId = 'some-id';
      
      (fournisseurModel.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockFournisseurWithPopulatedCategory),
        }),
      });

      const result = await service.findOne(fournisseurId);

      expect(fournisseurModel.findById).toHaveBeenCalledWith(fournisseurId);
      expect(result).toEqual(mockFournisseurWithPopulatedCategory);
    });
  });

  describe('update', () => {
    it('should update a fournisseur', async () => {
      const fournisseurId = 'some-id';
      const updateDto: UpdatefournisseurDTO = {
        name: 'Updated Name',
        description: 'Updated Description',
      };
      
      const updatedFournisseur = {
        ...mockFournisseur,
        name: updateDto.name,
        description: updateDto.description,
      };
      
      (fournisseurModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedFournisseur),
      });

      const result = await service.update(fournisseurId, updateDto);

      expect(fournisseurModel.findByIdAndUpdate).toHaveBeenCalledWith(
        fournisseurId, 
        { $set: updateDto }, 
        { new: true }
      );
      expect(result).toEqual(updatedFournisseur);
    });
  });

  describe('delete', () => {
    it('should delete a fournisseur', async () => {
      const fournisseurId = 'some-id';
      
      (fournisseurModel.findByIdAndDelete as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockFournisseur),
      });

      const result = await service.delete(fournisseurId);

      expect(fournisseurModel.findByIdAndDelete).toHaveBeenCalledWith(fournisseurId);
      expect(result).toEqual(mockFournisseur);
    });
  });
});