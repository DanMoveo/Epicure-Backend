// src/controllers/user.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto, LoginDto } from 'src/dto/user.dto';
import { UserService } from 'src/services/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const newUser = new CreateUserDto();
    newUser.email = createUserDto.email;
    newUser.password = createUserDto.password;

    return this.userService.register(newUser);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }
}
