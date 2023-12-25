import {
  Controller,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from 'src/Auth/auth.dto';
import { LoginDto } from 'src/User/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    try {
      const result = await this.authService.signUp(signUpDto);
      return result;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message || 'Failed to sign up');
    }
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    try {
      const result = await this.authService.login(loginDto);
      return result;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message || 'Failed to log in');
    }
  }
}
