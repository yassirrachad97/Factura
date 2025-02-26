import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { RegisterDto } from './DTO/register.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  
  async register(dto: RegisterDto, deviceId: string): Promise<User> {
    try {
      const existingUser = await this.findByEmail(dto.email);
      if (existingUser) throw new BadRequestException('Cet email est déjà utilisé');
  
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
      dto.password = await bcrypt.hash(dto.password, saltRounds);
  
      const user = new this.userModel({ ...dto, devices: [deviceId], isVerified: false });
      await user.save();
  
      const token = await this.generateVerificationToken(dto.email);
      const verificationLink = `http://yourdomain.com/verify-email?token=${token}&deviceId=${deviceId}`;
  
      await this.sendVerificationEmail(dto.email, verificationLink);
  
      return user;
    } catch (error) {
      console.error(`Erreur lors de l'inscription : ${error}`);
      throw new BadRequestException('Erreur lors de l\'inscription');
    }
  }
  
  async verifyEmail(token: string, deviceId: string): Promise<boolean> {
    if (!token || typeof token !== 'string') {
      throw new BadRequestException('Token de vérification invalide');
    }
  
    const user = await this.userModel.findOne({ verificationToken: token });
    if (!user || user.verificationTokenExpires < new Date()) {
      return false;
    }
  
    if (!user.devices.includes(deviceId)) {
      user.devices.push(deviceId);
    }
  
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
  
    await user.save();
  
    return true;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }


  async generateOTP(email: string): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
  
    const user = await this.userModel.findOne({ email });
    if (!user) throw new Error('Utilisateur non trouvé');
  
    user.otp = otp;
    user.otpExpires = otpExpires;
  
    await user.save();
  
    console.log(`OTP généré pour ${email} : ${otp}`);
    return otp;
  }

 
  async verifyOTP(email: string, otp: string, deviceId: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    if (!user || user.otp !== otp || user.otpExpires < new Date()) {
      return false;
    }
  
    
    if (!user.devices.includes(deviceId)) {
      user.devices.push(deviceId);
    }
  
    await this.userModel.updateOne({ email }, { otp: null, otpExpires: null, isVerified: true });
  
    return true;
  }
  

 
  async addDevice(userId: string, deviceId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new BadRequestException('Utilisateur non trouvé');

    if (!user.devices) user.devices = [];
    if (!user.devices.includes(deviceId)) {
      user.devices.push(deviceId);
    }

    return user.save();
  }

 
  async sendVerificationEmail(email: string, token: string) {
    const verificationLink = `http://yourdomain.com/verify-email?token=${token}`;
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  
    const mailOptions = {
      from: process.env.EMAIL_FROM_ADDRESS,
      to: email,
      subject: 'Vérification de connexion sur un nouvel appareil',
      html: `
        <p>Vous avez tenté de vous connecter depuis un nouvel appareil.</p>
        <p>Cliquez sur le lien suivant pour vérifier votre appareil :</p>
        <a href="${verificationLink}">Vérifier l'appareil</a>
        <p>Ce lien expirera dans 10 minutes.</p>
      `,
    };
  
    await transporter.sendMail(mailOptions);
  }
  


  async generateVerificationToken(email: string): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const tokenExpires = new Date(Date.now() + 10 * 60 * 1000); 
  
    const user = await this.findByEmailOrThrow(email);  
    user.verificationToken = token;
    user.verificationTokenExpires = tokenExpires;
  
    await user.save();
    return token;
  }
  

  async findByEmailOrThrow(email: string): Promise<User> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Utilisateur non trouvé');
    }
    return user;
  }
  
  
  
  
}
