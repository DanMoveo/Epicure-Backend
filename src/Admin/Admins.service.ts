import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from './Admin.model';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, SignUpDto } from './Admin.dto';
import { Role } from 'src/shared/enums/role.enum';

@Injectable()
export class AdminsService {
  constructor(
    @InjectModel(Admin.name)
    private adminModel: Model<Admin>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { name, email, password } = signUpDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const defaultRole = [Role.User];
    const admin = await this.adminModel.create({
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
    const admin = await this.adminModel.findOne({ email });
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

  getAllAdmins(): Promise<Admin[]> {
    return this.adminModel.find().exec();
  }

  async getAdminById(id: string): Promise<Admin | null> {
    return this.adminModel.findById(id).exec();
  }

  async addAdmin(adminData: {
    name: string;
    password: string;
  }): Promise<Admin> {
    const admin = new this.adminModel(adminData);
    await admin.save();
    return admin;
  }

  async updateAdmin(
    id: string,
    adminData: { name: string; password: string },
  ): Promise<Admin | null> {
    return this.adminModel
      .findByIdAndUpdate(id, adminData, { new: true })
      .exec();
  }

  async deleteAdmin(id: string): Promise<boolean> {
    const result = await this.adminModel.findByIdAndRemove(id).exec();
    return !!result;
  }
}
