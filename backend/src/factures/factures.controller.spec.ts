import { Test, TestingModule } from '@nestjs/testing';
import { FacturesController } from './factures.controller';
import { FacturesService } from './factures.service';
import { CreateFactureDTO } from './DTO/create-facture.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('FacturesController', () => {
  let controller: FacturesController;
  let service: FacturesService;

  const mockFacturesService = {
    generateInvoice: jest.fn().mockResolvedValue({ _id: 'testId', total: 100 }),
    getUserInvoices: jest.fn().mockResolvedValue([{ _id: 'testId', total: 100 }]),
    getInvoiceById: jest.fn().mockResolvedValue({ _id: 'testId', total: 100 }),
    markInvoiceAsPaid: jest.fn().mockResolvedValue({ _id: 'testId', status: 'paid' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FacturesController],
      providers: [{ provide: FacturesService, useValue: mockFacturesService }],
    }).compile();

    controller = module.get<FacturesController>(FacturesController);
    service = module.get<FacturesService>(FacturesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('generateFacture', () => {
    it('should generate an invoice', async () => {
      const dto: CreateFactureDTO = {
        fournisseurId: 'testFournisseur',
        amount: 500,
        dueDate: '2025-03-21',
        contractNumber: 'CN123456',
        serviceType: 'Maintenance',
        serviceName: 'Annual Inspection',
      };
      
      const req = { user: { _id: 'userId' } };
      const result = await controller.generateFacture(req, dto);
      expect(result).toEqual({ _id: 'testId', total: 100, id: 'testId' });
      expect(service.generateInvoice).toHaveBeenCalledWith('userId', dto);

    });

    it('should throw UnauthorizedException if user is not authenticated', async () => {
      await expect(controller.generateFacture({ user: null }, {} as CreateFactureDTO)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getUserFactures', () => {
    it('should return user invoices', async () => {
      const req = { user: { _id: 'userId' } };
      const result = await controller.getUserFactures(req);
      expect(result).toEqual([{ _id: 'testId', total: 100 }]);
      expect(service.getUserInvoices).toHaveBeenCalledWith('userId');
    });

    it('should throw UnauthorizedException if user is not authenticated', async () => {
      await expect(controller.getUserFactures({ user: null })).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getFacture', () => {
    it('should return an invoice by id', async () => {
      const result = await controller.getFacture('testId');
      expect(result).toEqual({ _id: 'testId', total: 100 });
      expect(service.getInvoiceById).toHaveBeenCalledWith('testId');
    });
  });

  describe('markFactureAsPaid', () => {
    it('should mark an invoice as paid', async () => {
      const result = await controller.markFactureAsPaid('testId');
      expect(result).toEqual({ _id: 'testId', status: 'paid' });
      expect(service.markInvoiceAsPaid).toHaveBeenCalledWith('testId');
    });
  });
});