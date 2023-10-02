// src/users/user.service.ts
import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, LoginDto } from '../dto/user.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/models/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;

    try {
      // Check if the user with the same email already exists
      const existingUser = await this.userModel.findOne({ email }).exec();
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const createdUser = new this.userModel({
        email,
        password: hashedPassword, 
      });

      return createdUser.save();
    } catch (error) {
      throw new Error('Unable to register user');
    }
  }

  async login(loginDto: LoginDto): Promise<User | null> {
    const { email, password } = loginDto;

    try {
      const user = await this.userModel.findOne({ email }).exec();

      if (user) {
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
          return user;
        } else {
          throw new UnauthorizedException('Invalid password');
        }
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      throw new Error('Unable to login');
    }
  }
}
