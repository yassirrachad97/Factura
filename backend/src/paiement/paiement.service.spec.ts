import { Test, TestingModule } from '@nestjs/testing';
import { PaiementService } from './paiement.service';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { factures } from '../factures/schema/facture.schema';
import { User } from '../users/schema/user.schema';
import { BadRequestException } from '@nestjs/common';

describe('PaiementService', () => {
  let service: PaiementService;
  let mockConfigService: Partial<ConfigService>;
  let mockFactureModel: any;
  let mockUserModel: any;

  beforeEach(async () => {
    mockConfigService = {
      get: jest.fn().mockReturnValue('mocked-secret-key'), // Mocking only the get method
    };

    mockFactureModel = {
      findById: jest.fn().mockReturnThis(), // Mocking findById to return itself for chaining
      exec: jest.fn().mockResolvedValue({ id: 'facture-id', amount: 100, isPaid: false, contractNumber: 'CN123456' }), // Mocking exec() to return a resolved facture
      findByIdAndUpdate: jest.fn(),
    };

    mockUserModel = {
      findById: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaiementService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: getModelToken(factures.name), useValue: mockFactureModel },
        { provide: getModelToken(User.name), useValue: mockUserModel },
      ],
    }).compile();

    service = module.get<PaiementService>(PaiementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw BadRequestException if facture is already paid', async () => {
    const mockFacture = {
      id: 'facture-id',
      amount: 100,
      isPaid: true, // Simulating an already paid facture
      contractNumber: 'CN123456',
    };

    mockFactureModel.findById.mockResolvedValue(mockFacture);

    await expect(service.createPaymentIntent('facture-id', 'user-id')).rejects.toThrow(BadRequestException);
  });
});
