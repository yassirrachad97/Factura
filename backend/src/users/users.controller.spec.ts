import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RegisterDto } from './DTO/register.dto';
import { SendOtpDto } from './DTO/send-otp.dto';
import { VerifyOtpDto } from './DTO/verify-otp.dto';
import { AuthGuard } from '@nestjs/passport';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;


  const mockUsersService = {
    register: jest.fn(),
    verifyEmail: jest.fn(),
    generateOTP: jest.fn(),
    verifyOTP: jest.fn(),
    resetPassword: jest.fn(),
    changePassword: jest.fn(),
    resendOtp: jest.fn(),
    getAllUsersHaveRoleUser: jest.fn(),
    updateUserRole: jest.fn(),
    getUserInfo: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService
        }
      ]
    })
    .overrideGuard(AuthGuard('jwt'))
    .useValue({ canActivate: jest.fn(() => true) })
    .compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(usersService).toBeDefined();
  });

  describe('register', () => {
    it('should call usersService.register with correct DTO', async () => {

      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'Password123',
        firstname: 'John',
        lastname: 'Doe',
        username: 'johndoe',
        telephone: '1234567890'
      };
      const expectedResult = { 
        message: 'Inscription réussie. Veuillez vérifier votre email.' 
      };
      mockUsersService.register.mockResolvedValue(expectedResult);


      const result = await controller.register(registerDto);

  
      expect(usersService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('verifyEmail', () => {
    it('should redirect to homepage when verification is successful', async () => {
     
      const token = 'valid-verification-token';
      mockUsersService.verifyEmail.mockResolvedValue(true);

    
      const result = await controller.verifyEmail(token);

     
      expect(usersService.verifyEmail).toHaveBeenCalledWith(token);
      expect(result).toEqual({ url: 'http://localhost:5173/' });
    });

    it('should return error message when verification fails', async () => {
  
      const token = 'invalid-token';
      mockUsersService.verifyEmail.mockResolvedValue(false);


      const result = await controller.verifyEmail(token);


      expect(usersService.verifyEmail).toHaveBeenCalledWith(token);
      expect(result).toEqual({ message: 'Lien invalide ou expiré.' });
    });
  });

  describe('generateOtp', () => {
    it('should call usersService.generateOTP with correct email', async () => {
   
      const sendOtpDto: SendOtpDto = { 
        email: 'test@example.com',
        newPassword: 'Password123',
        opt: '123456'
      };
      const expectedOtp = '123456';
      mockUsersService.generateOTP.mockResolvedValue(expectedOtp);

    
      const result = await controller.generateOtp(sendOtpDto);


      expect(usersService.generateOTP).toHaveBeenCalledWith(sendOtpDto.email);
      expect(result).toEqual(expectedOtp);
    });
  });

  describe('verifyOtp', () => {
    it('should return success message when OTP is valid', async () => {
    
      const verifyOtpDto: VerifyOtpDto = { 
        email: 'test@example.com', 
        otp: '123456' 
      };
      const headers = { 'user-agent': 'test-device' };
      mockUsersService.verifyOTP.mockResolvedValue(true);

      
      const result = await controller.verifyOtp(verifyOtpDto, headers);


      expect(usersService.verifyOTP).toHaveBeenCalledWith(
        verifyOtpDto.email, 
        verifyOtpDto.otp, 
        'test-device'
      );
      expect(result).toEqual({ message: 'OTP validé avec succès' });
    });

    it('should return error message when OTP is invalid', async () => {
    
      const verifyOtpDto: VerifyOtpDto = { 
        email: 'test@example.com', 
        otp: 'invalid' 
      };
      const headers = { 'user-agent': 'test-device' };
      mockUsersService.verifyOTP.mockResolvedValue(false);


      const result = await controller.verifyOtp(verifyOtpDto, headers);

  
      expect(usersService.verifyOTP).toHaveBeenCalledWith(
        verifyOtpDto.email, 
        verifyOtpDto.otp, 
        'test-device'
      );
      expect(result).toEqual({ message: 'OTP invalide ou expiré' });
    });
  });

  describe('ResetPassword', () => {
    it('should call usersService.resetPassword with correct parameters', async () => {
   
      const resetPasswordDto: SendOtpDto = { 
        email: 'test@example.com',
        newPassword: 'NewPassword123',
        opt: '123456'
      };
      const expectedResult = { message: 'Mot de passe réinitialisé avec succès' };
      mockUsersService.resetPassword.mockResolvedValue(expectedResult);


      const result = await controller.ResetPassword(resetPasswordDto);

  
      expect(usersService.resetPassword).toHaveBeenCalledWith(
        resetPasswordDto.email, 
        resetPasswordDto.newPassword
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('resendOtp', () => {
    it('should call usersService.resendOtp with correct email', async () => {
     
      const resendOtpDto: SendOtpDto = { 
        email: 'test@example.com',
        newPassword: 'Password123',
        opt: '123456'
      };
      const expectedResult = { message: 'OTP renvoyé avec succès' };
      mockUsersService.resendOtp.mockResolvedValue(expectedResult);

    
      const result = await controller.resendOtp(resendOtpDto);

      expect(usersService.resendOtp).toHaveBeenCalledWith(resendOtpDto.email);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getAllUsersHaveRoleUser', () => {
    it('should return all users with role user', async () => {
  
      const expectedUsers = [
        { email: 'user1@example.com', role: 'user' },
        { email: 'user2@example.com', role: 'user' }
      ];
      mockUsersService.getAllUsersHaveRoleUser.mockResolvedValue(expectedUsers);


      const result = await controller.getAllUsersHaveRoleUser();

  
      expect(usersService.getAllUsersHaveRoleUser).toHaveBeenCalled();
      expect(result).toEqual(expectedUsers);
    });
  });

  describe('updateUserRole', () => {
    it('should call usersService.updateUserRole with correct parameters', async () => {
     
      const updateRoleDto = { email: 'test@example.com', role: 'admin' };
      const expectedResult = { message: 'Rôle mis à jour avec succès' };
      mockUsersService.updateUserRole.mockResolvedValue(expectedResult);


      const result = await controller.updateUserRole(updateRoleDto);

 
      expect(usersService.updateUserRole).toHaveBeenCalledWith(
        updateRoleDto.email, 
        updateRoleDto.role
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getUserProfile', () => {
    it('should return user profile when authenticated', async () => {
    
      const req = { user: { email: 'test@example.com' } };
      const expectedProfile = { 
        email: 'test@example.com', 
        firstname: 'John',
        lastname: 'Doe',
        role: 'user'
      };
      mockUsersService.getUserInfo.mockResolvedValue(expectedProfile);

    
      const result = await controller.getUserProfile(req);

  
      expect(usersService.getUserInfo).toHaveBeenCalledWith(req.user.email);
      expect(result).toEqual(expectedProfile);
    });
  });
});