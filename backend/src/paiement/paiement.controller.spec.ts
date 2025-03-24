import { Test, TestingModule } from '@nestjs/testing';
import { PaiementController } from './paiement.controller';
import { PaiementService } from './paiement.service';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

// Mock du service PaiementService
const mockPaiementService = {
  createPaymentIntent: jest.fn(),
  confirmPayment: jest.fn(),
  getPaymentStatus: jest.fn(),
  handleWebhook: jest.fn(),
};

describe('PaiementController', () => {
  let controller: PaiementController;
  let paiementService: PaiementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaiementController],
      providers: [
        { provide: PaiementService, useValue: mockPaiementService },
      ],
    }).compile();

    controller = module.get<PaiementController>(PaiementController);
    paiementService = module.get<PaiementService>(PaiementService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createPaymentIntent', () => {
    it('should call createPaymentIntent from PaiementService', async () => {
      const mockFactureId = 'testFactureId';
      const mockUserId = 'testUserId';
      const mockResponse = { clientSecret: 'client_secret_123' };

      // Mock de la méthode createPaymentIntent du service
      mockPaiementService.createPaymentIntent.mockResolvedValue(mockResponse);

      const result = await controller.createPaymentIntent(
        mockFactureId,
        { user: { _id: mockUserId } } as any, // Mock de req.user
      );

      expect(result).toEqual(mockResponse);
      expect(mockPaiementService.createPaymentIntent).toHaveBeenCalledWith(
        mockFactureId,
        mockUserId,
      );
    });
  });

  describe('confirmPayment', () => {
    it('should call confirmPayment from PaiementService', async () => {
      const mockPaymentIntentId = 'paymentIntentId123';
      const mockResponse = { status: 'confirmed' };

      // Mock de la méthode confirmPayment du service
      mockPaiementService.confirmPayment.mockResolvedValue(mockResponse);

      const result = await controller.confirmPayment(mockPaymentIntentId);

      expect(result).toEqual(mockResponse);
      expect(mockPaiementService.confirmPayment).toHaveBeenCalledWith(mockPaymentIntentId);
    });
  });

  describe('getPaymentStatus', () => {
    it('should call getPaymentStatus from PaiementService', async () => {
      const mockPaymentIntentId = 'paymentIntentId123';
      const mockResponse = { status: 'succeeded' };

      // Mock de la méthode getPaymentStatus du service
      mockPaiementService.getPaymentStatus.mockResolvedValue(mockResponse);

      const result = await controller.getPaymentStatus(mockPaymentIntentId);

      expect(result).toEqual(mockResponse);
      expect(mockPaiementService.getPaymentStatus).toHaveBeenCalledWith(mockPaymentIntentId);
    });
  });

  describe('handleWebhook', () => {
    it('should call handleWebhook from PaiementService', async () => {
      const mockSignature = 'signature123';
      const mockRawBody = 'raw_body_here';
      const mockResponse = { received: true };

      // Mock de la méthode handleWebhook du service
      mockPaiementService.handleWebhook.mockResolvedValue(mockResponse);

      const result = await controller.handleWebhook(mockSignature, {
        rawBody: mockRawBody,
      } as any);

      expect(result).toEqual(mockResponse);
      expect(mockPaiementService.handleWebhook).toHaveBeenCalledWith(
        mockSignature,
        mockRawBody,
      );
    });
  });
});
