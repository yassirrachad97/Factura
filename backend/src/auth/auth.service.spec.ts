import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../users/schema/user.schema';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser = {
    _id: 'mockId',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: 'user',
    devices: []
  };

  const mockUsersService = {
    findByEmailOrThrow: jest.fn(),
    generateOTP: jest.fn(),
    sendOTP: jest.fn()
  };

  const mockJwtService = {
    sign: jest.fn(() => 'mockToken'),
    verify: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn() },
        }
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123'
    };
    const deviceId = 'test-device';

    it('should return OTP status when new device is detected', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      mockUsersService.findByEmailOrThrow.mockResolvedValue({
        ...mockUser,
        password: hashedPassword
      });
      mockUsersService.generateOTP.mockResolvedValue('123456');

      const result = await authService.login(loginDto, deviceId);

      expect(result.status).toBe(201);
      expect(result.message).toContain('Nouveau périphérique détecté');
      expect(mockUsersService.generateOTP).toHaveBeenCalled();
      expect(mockUsersService.sendOTP).toHaveBeenCalled();
    });

    it('should return token when device is already authorized', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      mockUsersService.findByEmailOrThrow.mockResolvedValue({
        ...mockUser,
        password: hashedPassword,
        devices: [{ deviceName: deviceId, iscourrant: true }]
      });

      const result = await authService.login(loginDto, deviceId);

      expect(result.status).toBe(200);
      expect(result.token).toBeDefined();
      expect(result.user).toBeDefined();
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const hashedPassword = await bcrypt.hash('differentpassword', 10);
      mockUsersService.findByEmailOrThrow.mockResolvedValue({
        ...mockUser,
        password: hashedPassword
      });

      await expect(authService.login(loginDto, deviceId)).rejects.toThrow('Email ou mot de passe incorrect');
    });
  });

  describe('verifyToken', () => {
    it('should return decoded token when valid', async () => {
      const mockDecodedToken = { sub: 'userId', email: 'test@example.com' };
      mockJwtService.verify.mockReturnValue(mockDecodedToken);

      const result = await authService.verifyToken('valid-token');
      expect(result).toEqual(mockDecodedToken);
    });

    it('should throw UnauthorizedException when token is invalid', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error();
      });

      await expect(authService.verifyToken('invalid-token')).rejects.toThrow('Token invalide ou expiré');
    });
  });
});
