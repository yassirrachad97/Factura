import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserRole } from './schema/user.schema';
import { BadRequestException } from '@nestjs/common';
import { RegisterDto } from './DTO/register.dto';
import * as bcrypt from 'bcryptjs';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<User>;

  const mockUser = {
    email: 'test@example.com',
    password: 'hashedPassword123',
    role: UserRole.USER,
    isVerified: false,
    verificationToken: 'token123',
    verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    firstname: 'John', 
    lastname: 'Doe', 
    username: 'johndoe', 
    telephone: '1234567890',
    devices: [],
    save: jest.fn().mockResolvedValue({}),
  };

  // Mock de l'implémentation du constructeur du modèle
  const mockUserModelFactory = jest.fn().mockImplementation(dto => ({
    ...dto,
    save: jest.fn().mockImplementation(() => Promise.resolve(dto)),
  }));

  const mockUserModel = {
    create: jest.fn().mockImplementation((dto) => ({
      ...dto,
      save: jest.fn().mockResolvedValue(dto),
    })),
    findOne: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null), 
    }),
    find: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([]), 
    }),
    findById: jest.fn(),
    updateOne: jest.fn().mockResolvedValue({}),
  };
  

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            ...mockUserModel,
            // Ajouter le constructeur mockée directement dans le fournisseur
            new: mockUserModelFactory
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(getModelToken(User.name));

    // Mock bcrypt hash
    jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('hashedPassword123'));
    jest.spyOn(bcrypt, 'compare').mockImplementation((plaintext, hash) => {
      return Promise.resolve(plaintext === 'oldPassword123');
    });

    // Mock internal methods
    jest.spyOn(service, 'findByEmail').mockImplementation((email) => {
      if (email === 'test@example.com') {
        return Promise.resolve(mockUser as any);
      }
      return Promise.resolve(null);
    });

    jest.spyOn(service, 'findByEmailOrThrow').mockImplementation((email) => {
      if (email === 'test@example.com') {
        return Promise.resolve(mockUser as any);
      }
      throw new BadRequestException('Utilisateur non trouvé');
    });

    jest.spyOn(service, 'generateVerificationToken').mockResolvedValue('token123');
    jest.spyOn(service, 'sendVerificationEmail').mockResolvedValue(undefined);
    jest.spyOn(service, 'sendOTP').mockResolvedValue(undefined);
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const registerDto: RegisterDto = {
        email: 'new@example.com',
        password: 'password123',
        firstname: 'John',
        lastname: 'Doe',
        username: 'johndoe',
        telephone: '1234567890',
      };

      jest.spyOn(service, 'findByEmail').mockResolvedValueOnce(null);
      
      // Nous utilisons le mock de constructeur déjà défini
      const savedUser = {
        ...registerDto,
        isVerified: false,
        id: 'mockedId'
      };
      
      mockUserModelFactory.mockReturnValueOnce({
        ...savedUser,
        save: jest.fn().mockResolvedValue(savedUser)
      });

      const result = await service.register(registerDto);

      expect(result).toBeDefined();
      expect(service.generateVerificationToken).toHaveBeenCalledWith('new@example.com');
      expect(service.sendVerificationEmail).toHaveBeenCalledWith('new@example.com', 'token123');
    });

    it('should throw BadRequestException if email is already used', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        firstname: 'John',
        lastname: 'Doe',
        username: 'johndoe',
        telephone: '1234567890',
      };

      jest.spyOn(service, 'findByEmail').mockResolvedValueOnce(mockUser as any);

      await expect(service.register(registerDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('verifyEmail', () => {
    it('should verify email with valid token', async () => {
      const token = 'validToken';
      mockUserModel.findOne.mockResolvedValueOnce({
        ...mockUser,
        verificationToken: token,
        verificationTokenExpires: new Date(Date.now() + 10 * 60 * 1000),
        save: jest.fn().mockResolvedValue({})
      });

      const result = await service.verifyEmail(token);

      expect(result).toBe(true);
    });

    it('should return false for invalid token', async () => {
      mockUserModel.findOne.mockResolvedValueOnce(null);

      const result = await service.verifyEmail('invalidToken');

      expect(result).toBe(false);
    });
  });

  describe('generateOTP', () => {
    it('should generate and save OTP for the user', async () => {
      const user = { 
        ...mockUser, 
        save: jest.fn().mockResolvedValue({})
      };
      mockUserModel.findOne.mockResolvedValueOnce(user);
      
      const result = await service.generateOTP('test@example.com');

      expect(result).toBeDefined();
      expect(result.length).toBe(6);
      expect(user.save).toHaveBeenCalled();
    });

    it('should throw error if user not found', async () => {
      mockUserModel.findOne.mockResolvedValueOnce(null);

      await expect(service.generateOTP('notfound@example.com')).rejects.toThrow('Utilisateur non trouvé');
    });
  });

  describe('verifyOTP', () => {
    it('should verify OTP and add device if valid', async () => {
      const user = {
        ...mockUser,
        otp: '123456',
        otpExpires: new Date(Date.now() + 5 * 60 * 1000),
        devices: [],
        save: jest.fn().mockResolvedValue({}),
      };
      jest.spyOn(service, 'findByEmail').mockResolvedValueOnce(user as any);

      const result = await service.verifyOTP('test@example.com', '123456', 'device123');

      expect(result).toBe(true);
      expect(user.save).toHaveBeenCalled();
      expect(mockUserModel.updateOne).toHaveBeenCalledWith(
        { email: 'test@example.com' },
        { otp: null, otpExpires: null }
      );
    });

    it('should return false for invalid OTP', async () => {
      const user = {
        ...mockUser,
        otp: '123456',
        otpExpires: new Date(Date.now() - 1000),
      };
      jest.spyOn(service, 'findByEmail').mockResolvedValueOnce(user as any);

      const result = await service.verifyOTP('test@example.com', 'wrongOTP', 'device123');

      expect(result).toBe(false);
    });
  });

  describe('addDevice', () => {
    it('should add a new device to the user', async () => {
      const user = {
        ...mockUser,
        devices: [],
        save: jest.fn().mockResolvedValue({
          ...mockUser,
          devices: [{ deviceName: 'device123', iscourrant: false }],
        }),
      };
      mockUserModel.findById.mockResolvedValueOnce(user);

      const result = await service.addDevice('userId123', 'device123');

      expect(user.save).toHaveBeenCalled();
      expect(result.devices).toEqual([{ deviceName: 'device123', iscourrant: false }]);
    });

    it('should throw BadRequestException if user not found', async () => {
      mockUserModel.findById.mockResolvedValueOnce(null);

      await expect(service.addDevice('notfound', 'device123')).rejects.toThrow(BadRequestException);
    });
  });

  describe('changePassword', () => {
    it('should change the password if old password is correct', async () => {
      const user = {
        ...mockUser,
        save: jest.fn().mockResolvedValue({}),
      };
      jest.spyOn(service, 'findByEmailOrThrow').mockResolvedValueOnce(user as any);

      await service.changePassword('test@example.com', 'oldPassword123', 'newPassword123');

      expect(user.save).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword123', expect.any(Number));
    });

    it('should throw BadRequestException if old password is incorrect', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);

      await expect(service.changePassword('test@example.com', 'wrongOldPassword', 'newPassword123'))
        .rejects.toThrow('Ancien mot de passe incorrect');
    });
  });

  describe('resendOtp', () => {
    it('should resend OTP to the user', async () => {
      jest.spyOn(service, 'generateOTP').mockResolvedValueOnce('123456');

      await service.resendOtp('test@example.com');

      expect(service.generateOTP).toHaveBeenCalledWith('test@example.com');
      expect(service.sendOTP).toHaveBeenCalledWith('test@example.com', '123456');
    });
  });

  describe('getUserInfo', () => {
    it('should return user info', async () => {
      const result = await service.getUserInfo('test@example.com');

      expect(result).toEqual({
        firstname: mockUser.firstname,
        lastname: mockUser.lastname,
        username: mockUser.username,
        telephone: mockUser.telephone,
        email: mockUser.email,
        role: mockUser.role,
      });
    });

    it('should throw BadRequestException if user not found', async () => {
      jest.spyOn(service, 'findByEmailOrThrow').mockRejectedValueOnce(new BadRequestException('Utilisateur non trouvé'));

      await expect(service.getUserInfo('notfound@example.com')).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateUserRole', () => {
    it('should update user role', async () => {
      const user = {
        ...mockUser,
        save: jest.fn().mockResolvedValue({ ...mockUser, role: UserRole.ADMIN }),
      };
      jest.spyOn(service, 'findByEmailOrThrow').mockResolvedValueOnce(user as any);

      const result = await service.updateUserRole('test@example.com', UserRole.ADMIN);

      expect(user.role).toBe(UserRole.ADMIN);
      expect(user.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException for invalid role', async () => {
      await expect(service.updateUserRole('test@example.com', 'invalid_role'))
        .rejects.toThrow('Role invalide');
    });
  });

  describe('resetPassword', () => {
    it('should reset the password for the user', async () => {
      const user = {
        ...mockUser,
        save: jest.fn().mockResolvedValue({}),
      };
      jest.spyOn(service, 'findByEmailOrThrow').mockResolvedValueOnce(user as any);

      const result = await service.resetPassword('test@example.com', 'newPassword123');

      expect(result).toBe('Mot de passe réinitialisé avec succès');
      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword123', 10);
      expect(user.save).toHaveBeenCalled();
    });
  });
});