// src/users/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, LoginDto } from '../dto/user.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/models/user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel( User.name) private readonly userModel: Model<User>) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = new this.userModel({
        email,
      password: hashedPassword, // Store the hashed password in the database
    });

    return createdUser.save();
  }

  async login(loginDto: LoginDto): Promise<User | null> {
    return this.userModel.findOne({ email: loginDto.email }).exec();
  }
}
