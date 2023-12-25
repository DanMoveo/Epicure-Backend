import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Role } from 'src/shared/enums/role.enum';
import { SignUpDto, LoginDto } from './auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from '../Admin/Admins.model';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin.name)
    private authModel: Model<Admin>,
    private jwtService: JwtService,
  ) {}
  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { name, email, password } = signUpDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const defaultRole = [Role.User];
    const admin = await this.authModel.create({
      name,
      email,
      password: hashedPassword,
      roles: defaultRole,
    });
    const token = this.jwtService.sign(
      {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        roles: admin.roles,
      },
      { secret: 'dandan' },
    );
    return { token };
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;
    const admin = await this.authModel.findOne({ email });
    if (!admin) {
      throw new UnauthorizedException('Invaild email or password');
    }
    const isPasswordMatched = await bcrypt.compare(password, admin.password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invaild  password');
    }
    console.log(`User role: ${admin.roles}`);
    const token = this.jwtService.sign(
      {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        roles: admin.roles,
      },
      { secret: 'dandan' },
    );
    return { token };
  }
}
