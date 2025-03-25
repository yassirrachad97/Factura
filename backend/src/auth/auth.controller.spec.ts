import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './DTO/login.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

 
  const mockAuthService = {
    login: jest.fn(),
    verifyToken: jest.fn()
  };

  const mockUsersService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService
        },
        {
          provide: UsersService,
          useValue: mockUsersService
        }
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login with correct parameters and return OTP status for new device', async () => {

      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123'
      };
      const headers = {
        'user-agent': 'test-device-id'
      };
      const expectedResult = {
        message: 'Nouveau périphérique détecté. Vérifiez votre email pour autoriser cet appareil.',
        status: 201,
        email: 'test@example.com'
      };
      mockAuthService.login.mockResolvedValue(expectedResult);


      const result = await controller.login(loginDto, headers);

      expect(authService.login).toHaveBeenCalledWith(loginDto, 'test-device-id');
      expect(result).toEqual(expectedResult);
    });

    it('should call authService.login and return token for existing device', async () => {
    
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123'
      };
      const headers = {
        'user-agent': 'test-device-id'
      };
      const expectedResult = {
        token: 'test-token',
        status: 200,
        user: {
          email: 'test@example.com',
          role: 'user'
        }
      };
      mockAuthService.login.mockResolvedValue(expectedResult);

   
      const result = await controller.login(loginDto, headers);

   
      expect(authService.login).toHaveBeenCalledWith(loginDto, 'test-device-id');
      expect(result).toEqual(expectedResult);
    });

    it('should handle login with missing user-agent header', async () => {
     
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123'
      };
      const headers = {}; 
      const expectedResult = {
        token: 'test-token',
        status: 200,
        user: {
          email: 'test@example.com',
          role: 'user'
        }
      };
      mockAuthService.login.mockResolvedValue(expectedResult);

     
      const result = await controller.login(loginDto, headers);

 
      expect(authService.login).toHaveBeenCalledWith(loginDto, undefined);
      expect(result).toEqual(expectedResult);
    });

    it('should throw an error when login credentials are invalid', async () => {

      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };
      const headers = {
        'user-agent': 'test-device-id'
      };
      mockAuthService.login.mockRejectedValue(new UnauthorizedException('Email ou mot de passe incorrect'));

  
      await expect(controller.login(loginDto, headers)).rejects.toThrow(UnauthorizedException);
      expect(authService.login).toHaveBeenCalledWith(loginDto, 'test-device-id');
    });
  });

  describe('verifyToken', () => {
    it('should call authService.verifyToken with correct token and return decoded payload', async () => {
  
      const token = 'valid-token';
      const expectedResult = { 
        sub: 'user-id', 
        email: 'test@example.com',
        role: 'user'
      };
      mockAuthService.verifyToken.mockResolvedValue(expectedResult);

    
      const result = await controller.verifyToken(token);

     
      expect(authService.verifyToken).toHaveBeenCalledWith(token);
      expect(result).toEqual(expectedResult);
    });

    it('should throw UnauthorizedException when token is invalid', async () => {
     
      const token = 'invalid-token';
      mockAuthService.verifyToken.mockRejectedValue(new UnauthorizedException('Token invalide ou expiré'));

   
      await expect(controller.verifyToken(token)).rejects.toThrow(UnauthorizedException);
      expect(authService.verifyToken).toHaveBeenCalledWith(token);
    });

    it('should handle empty token', async () => {
     
      const token = '';
      mockAuthService.verifyToken.mockRejectedValue(new UnauthorizedException('Token invalide ou expiré'));

    
      await expect(controller.verifyToken(token)).rejects.toThrow(UnauthorizedException);
      expect(authService.verifyToken).toHaveBeenCalledWith('');
    });
  });
});