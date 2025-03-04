import { Controller, Post, Body, Get, Query,  Headers, Redirect } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { SendOtpDto } from './DTO/send-otp.dto';
import { VerifyOtpDto } from './DTO/verify-otp.dto';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.usersService.register(registerDto);
  }

  @Get('verify-email')
  @Redirect()
  async verifyEmail(@Query('token') token: string) {
    const isVerified = await this.usersService.verifyEmail(token);
    
    return isVerified
      ? {url: 'http://localhost:5173/' }
      : { message: 'Lien invalide ou expiré.' };
  }

  @Post('generate-otp')
  async generateOtp(@Body() body: SendOtpDto) {
    return this.usersService.generateOTP(body.email);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() body: VerifyOtpDto, @Headers() header: Record<string, string> ) {
    const deviceId = header['user-agent'];
    const isValid = await this.usersService.verifyOTP(body.email, body.otp, deviceId);
    return isValid ? { message: 'OTP validé avec succès' } : { message: 'OTP invalide ou expiré' };
  }
  @Post('ResetPassword')
  async ResetPassword(@Body() body: SendOtpDto) {
    console.log(body);
    return this.usersService.resetPassword(body.email, body.newPassword);
  }
  @Post('ChangePassword')
  async ChangePassword(@Body() body: SendOtpDto,oldPassword:string, newPassword:string) {
    return this.usersService.changePassword(body.email, oldPassword, newPassword);
  }
  @Post('resendOtp')
  async resendOtp(@Body() body: SendOtpDto) {
    return this.usersService.resendOtp(body.email);
  }
  
}
