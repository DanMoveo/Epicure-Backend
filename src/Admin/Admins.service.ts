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

@Injectable()
export class AdminsService {
  constructor(

    @InjectModel(Admin.name)
    private adminModel: Model<Admin>,
    private jwtService: JwtService,
  ) { }

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { name, email, password } = signUpDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await this.adminModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = this.jwtService.sign({ id: admin._id });

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

    const token = this.jwtService.sign({ id: admin._id });

    return { token };
  }

  async getAllAdmins(): Promise<Admin[]> {
    try {
      const admins = await this.adminModel.find().exec();
      if (!admins) {
        throw new NotFoundException('No admins found');
      }
      return admins;
    } catch (error) {
      throw new NotFoundException('Error fetching admins');
    }
  }

  async getAdminById(id: string): Promise<Admin | null> {
    try {
      const admin = await this.adminModel.findById(id).exec();
      if (!admin) {
        throw new NotFoundException('Admin not found');
      }
      return admin;
    } catch (error) {
      throw new NotFoundException('Error fetching admin');
    }
  }

  async addAdmin(adminData: { name: string; password: string }): Promise<Admin> {
    const admin = new this.adminModel(adminData);
    try {
      await admin.save();
      return admin;
    } catch (error) {
      throw new NotFoundException('Error adding admin');
    }
  }

  async updateAdmin(
    id: string,
    adminData: { name: string; password: string },
  ): Promise<Admin | null> {
    try {
      const admin = await this.adminModel.findByIdAndUpdate(
        id,
        adminData,
        { new: true }
      ).exec();
      if (!admin) {
        throw new NotFoundException('Admin not found');
      }
      return admin;
    } catch (error) {
      throw new NotFoundException('Error updating admin');
    }
  }

  async deleteAdmin(id: string): Promise<boolean> {
    try {
      const result = await this.adminModel.findByIdAndRemove(id).exec();
      if (!result) {
        throw new NotFoundException('Admin not found');
      }
      return true;
    } catch (error) {
      throw new NotFoundException('Error deleting admin');
    }
  }
}