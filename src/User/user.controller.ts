import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateUserDto, LoginDto } from 'src/User/user.dto';
import { UserService } from 'src/User/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //   @Role(EAdminRole.Admin)
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const newUser = new CreateUserDto();
      newUser.email = createUserDto.email;
      newUser.password = createUserDto.password;

      const registeredUser = await this.userService.register(newUser);

      return { message: 'User registered successfully', user: registeredUser };
    } catch (error) {
      throw new HttpException(
        'User registration failed. Please try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const user = await this.userService.login(loginDto);

      return { message: 'Login successful', user };
    } catch (error) {
      throw new HttpException(
        'Login failed. Check your email and password.',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
