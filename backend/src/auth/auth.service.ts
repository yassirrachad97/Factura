import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './DTO/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  
  async login(body: LoginDto, deviceId: string) {
    const user = await this.usersService.findByEmailOrThrow(body.email);
    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Email ou mot de passe incorrect');
  
   
  
    const isNewDevice = !user.devices?.some((device) => 
      
      device.deviceName === deviceId && device.iscourrant === true
    );
   
  
    if (isNewDevice) {
      const otp = await this.usersService.generateOTP(body.email);
      await this.usersService.sendOTP(body.email, otp);
    
      return {
        message: 'Nouveau périphérique détecté. Vérifiez votre email pour autoriser cet appareil.',
        status: 201,
        email: user.email,
      };
    }
    const payload = { sub: user._id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  
   return {
  token,
  status: 200,
  user: {
    email: user.email,
    role: user.role,
  },
};
  }
  

  async verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }
}
