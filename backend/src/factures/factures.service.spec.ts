import { Test, TestingModule } from '@nestjs/testing';
import { FacturesService } from './factures.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { factures } from './schema/facture.schema';
import { User } from '../users/schema/user.schema';
import { fournisseur } from '../fournisseurs/schema/fournisseur.schema';
import { NotFoundException } from '@nestjs/common';

describe('FacturesService', () => {
  let service: FacturesService;
  let factureModel: Model<factures>;
  let fournisseurModel: Model<fournisseur>;

  const mockFacture = {
    _id: 'testId',
    userId: 'userId',
    fournisseurId: 'fournisseurId',
    amount: 100,
    dueDate: new Date(),
    contractNumber: 'CN12345',
    isPaid: false,
    createdBy: 'userId',
    save: jest.fn().mockResolvedValue(this),
  };

  const mockFournisseur = {
    _id: 'fournisseurId',
    name: 'Test Fournisseur',
  };

  const mockFactureModel = {
    find: jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockFacture]),
      }),
    }),
    findById: jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockFacture),
      }),
    }),
    create: jest.fn().mockResolvedValue(mockFacture),
    findByIdAndUpdate: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockFacture),
    }),
    findByIdAndDelete: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockFacture),
    }),
    prototype: {
      save: jest.fn().mockResolvedValue(mockFacture),
    },
  };

  const mockFournisseurModel = {
    findById: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockFournisseur),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FacturesService,
        { provide: getModelToken(factures.name), useValue: mockFactureModel },
        { provide: getModelToken(User.name), useValue: {} }, // Mock vide pour userModel si non utilisé
        { provide: getModelToken(fournisseur.name), useValue: mockFournisseurModel },
      ],
    }).compile();

    service = module.get<FacturesService>(FacturesService);
    factureModel = module.get<Model<factures>>(getModelToken(factures.name));
    fournisseurModel = module.get<Model<fournisseur>>(getModelToken(fournisseur.name));
  });

  describe('generateInvoice', () => {
    it('should generate an invoice preview', async () => {
      const dto = {
        fournisseurId: 'fournisseurId',
        amount: 500,
        dueDate: '2025-03-21',
        contractNumber: 'CN123456',
        serviceType: 'Maintenance',
        serviceName: 'Annual Inspection',
      };

      const result = await service.generateInvoice('userId', dto);

      expect(result).toEqual(expect.objectContaining({
        userId: 'userId',
        fournisseurId: 'fournisseurId',
        amount: 500,
        isPaid: false,
        createdBy: 'userId',
      }));
    });

    it('should throw NotFoundException if fournisseurId is missing', async () => {
      const dto = {
        fournisseurId: '',
        amount: 500,
        dueDate: '2025-03-21',
        contractNumber: 'CN123456',
        serviceType: 'Maintenance',
        serviceName: 'Annual Inspection',
      };

      await expect(service.generateInvoice('userId', dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUserInvoices', () => {
    it('should return user invoices', async () => {
      const result = await service.getUserInvoices('userId');

      expect(result).toEqual([mockFacture]);
      expect(mockFactureModel.find).toHaveBeenCalledWith({ userId: 'userId' });
    });
  });
});
