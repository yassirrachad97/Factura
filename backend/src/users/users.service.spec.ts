import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { BadRequestException } from '@nestjs/common';
import { UserRole } from './schema/user.schema';

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<User>;

  const mockUser = {
    email: 'test@example.com',
    password: 'hashedPassword123',
    role: UserRole.USER,
    isVerified: false,
    verificationToken: 'token123',
    verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    save: jest.fn(),
  };

  const mockUserModel = {
    create: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  describe('verifyEmail', () => {
    it('should successfully verify email with valid token', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);
      mockUser.save.mockResolvedValue({ ...mockUser, isVerified: true });

      const result = await service.verifyEmail('token123');

      expect(result).toBe(true);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ verificationToken: 'token123' });
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should return false for invalid token', async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      const result = await service.verifyEmail('invalidToken');

      expect(result).toBe(false);
    });

    it('should throw BadRequestException for empty token', async () => {
      await expect(service.verifyEmail('')).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByEmailOrThrow', () => {
    it('should return user when found', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmailOrThrow('test@example.com');

      expect(result).toEqual(mockUser);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    });

    it('should throw BadRequestException when user not found', async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      await expect(service.findByEmailOrThrow('notfound@example.com'))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('updateUserRole', () => {
    it('should update user role to admin', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);
      mockUser.save.mockResolvedValue({ ...mockUser, role: UserRole.ADMIN });

      const result = await service.updateUserRole('test@example.com', UserRole.ADMIN);

      expect(result.role).toBe(UserRole.ADMIN);
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException for invalid role', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);

      await expect(service.updateUserRole('test@example.com', 'INVALID_ROLE'))
        .rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for non-existent user', async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      await expect(service.updateUserRole('notfound@example.com', UserRole.ADMIN))
        .rejects.toThrow(BadRequestException);
    });
  });
});
