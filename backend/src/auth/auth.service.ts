import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  
  async login(email: string, password: string, deviceId: string) {
    const user = await this.usersService.findByEmailOrThrow(email);
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Email ou mot de passe incorrect');
  
    if (!deviceId || typeof deviceId !== 'string') {
      throw new BadRequestException('Device ID invalide');
    }
  
    const isNewDevice = !user.devices?.includes(deviceId);
  
    if (isNewDevice) {
      const otp = await this.usersService.generateOTP(email);
      await this.usersService.sendVerificationEmail(email, otp);
  
      throw new UnauthorizedException('Nouveau périphérique détecté. Vérifiez votre email pour autoriser cet appareil.');
    }
  
    const payload = { sub: user._id, email: user.email };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  
    return { token };
  }
  

  async verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }
}
