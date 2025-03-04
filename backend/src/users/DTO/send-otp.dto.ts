import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendOtpDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;

  opt: string;
}
