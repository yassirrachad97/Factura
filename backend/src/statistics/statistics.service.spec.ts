import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { StatisticsService } from './statistics.service';
import { Category } from '../category/schema/category.schema';
import { fournisseur } from '../fournisseurs/schema/fournisseur.schema';
import { User } from '../users/schema/user.schema';
import { factures } from '../factures/schema/facture.schema';
import { Types } from 'mongoose';

describe('StatisticsService', () => {
  let service: StatisticsService;
  let categoryModel: any;
  let fournisseurModel: any;
  let userModel: any;
  let factureModel: any;


  const mockUsers = [
    { _id: new Types.ObjectId(), name: 'User 1', email: 'user1@example.com' },
    { _id: new Types.ObjectId(), name: 'User 2', email: 'user2@example.com' }
  ];

  const mockCategories = [
    { _id: new Types.ObjectId(), name: 'Catégorie 1' },
    { _id: new Types.ObjectId(), name: 'Catégorie 2' }
  ];

  const mockFournisseurs = [
    { _id: new Types.ObjectId(), name: 'Fournisseur 1', category: mockCategories[0]._id },
    { _id: new Types.ObjectId(), name: 'Fournisseur 2', category: mockCategories[0]._id },
    { _id: new Types.ObjectId(), name: 'Fournisseur 3', category: mockCategories[1]._id }
  ];

  const mockFactures = [
    { 
      _id: new Types.ObjectId(), 
      amount: 1000, 
      isPaid: true, 
      dueDate: new Date('2025-01-15'),
      createdAt: new Date('2025-01-10'),
      updatedAt: new Date('2025-01-10')
    },
    { 
      _id: new Types.ObjectId(), 
      amount: 2000, 
      isPaid: false, 
      dueDate: new Date('2025-02-15'),
      createdAt: new Date('2025-02-10'),
      updatedAt: new Date('2025-02-10')
    },
    { 
      _id: new Types.ObjectId(), 
      amount: 3000, 
      isPaid: true, 
      dueDate: new Date('2025-03-15'),
      createdAt: new Date('2025-03-10'),
      updatedAt: new Date('2025-03-10')
    }
  ];

  beforeEach(async () => {
   
    categoryModel = {
      find: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockCategories)
    };

    fournisseurModel = {
      find: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockFournisseurs)
    };

    userModel = {
      find: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockUsers)
    };

    factureModel = {
      find: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockFactures)
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsService,
        { provide: getModelToken(Category.name), useValue: categoryModel },
        { provide: getModelToken(fournisseur.name), useValue: fournisseurModel },
        { provide: getModelToken(User.name), useValue: userModel },
        { provide: getModelToken(factures.name), useValue: factureModel }
      ],
    }).compile();

    service = module.get<StatisticsService>(StatisticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should calculate statistics correctly', async () => {
    const result = await service.calculateStatistics();
    

    expect(result).toBeDefined();
    expect(result.fournisseurs).toEqual(mockFournisseurs);
    expect(result.users).toEqual(mockUsers);
    expect(result.factures).toEqual(mockFactures);
    
  
    expect(result.totalRevenue).toBe(6000); 
    expect(result.totalFactures).toBe(3);
    expect(result.totalPaidFactures).toBe(2);
    expect(result.totalUnpaidFactures).toBe(1);
    
 
    expect(result.monthlyRevenue[0].revenue).toBe(1000); 
    expect(result.monthlyRevenue[1].revenue).toBe(2000); 
    expect(result.monthlyRevenue[2].revenue).toBe(3000); 
    
   
    const categoryId1 = mockCategories[0]._id.toString();
    const categoryId2 = mockCategories[1]._id.toString();
    expect(result.fournisseursByCategory[categoryId1]).toBe(2);
    expect(result.fournisseursByCategory[categoryId2]).toBe(1);
  });

  it('should handle errors during statistics calculation', async () => {
  
    fournisseurModel.exec.mockRejectedValueOnce(new Error('Database error'));
    
    await expect(service.calculateStatistics()).rejects.toThrow('Database error');
  });
  
  it('should handle empty collections', async () => {
 
    fournisseurModel.exec.mockResolvedValueOnce([]);
    userModel.exec.mockResolvedValueOnce([]);
    factureModel.exec.mockResolvedValueOnce([]);
    
    const result = await service.calculateStatistics();
    
    expect(result.totalRevenue).toBe(0);
    expect(result.totalFactures).toBe(0);
    expect(result.totalPaidFactures).toBe(0);
    expect(result.totalUnpaidFactures).toBe(0);
    expect(result.fournisseursByCategory).toEqual({});
  });
});