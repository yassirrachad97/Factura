import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { SendOtpDto } from './DTO/send-otp.dto';
import { VerifyOtpDto } from './DTO/verify-otp.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Query('deviceId') deviceId: string) {
    return this.usersService.register(registerDto, deviceId);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string, @Query('deviceId') deviceId: string) {
    const isVerified = await this.usersService.verifyEmail(token, deviceId);
    return isVerified
      ? { message: 'Appareil vérifié avec succès. Vous pouvez vous connecter.' }
      : { message: 'Lien invalide ou expiré.' };
  }

  @Post('generate-otp')
  async generateOtp(@Body() body: SendOtpDto) {
    return this.usersService.generateOTP(body.email);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() body: VerifyOtpDto) {
    const isValid = await this.usersService.verifyOTP(body.email, body.otp, body.deviceId);
    return isValid ? { message: 'OTP validé avec succès' } : { message: 'OTP invalide ou expiré' };
  }
}
