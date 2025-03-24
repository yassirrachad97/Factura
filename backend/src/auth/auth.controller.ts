import { Controller, Post, Body, Get, Query, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() body: LoginDto, @Headers() Headers:Record<string,string>) {
    const deviceId = Headers['user-agent'];
    return this.authService.login(body, deviceId);
  }

  @Get('verify-token')
  async verifyToken(@Query('token') token: string) {
    return this.authService.verifyToken(token);
  }
}
