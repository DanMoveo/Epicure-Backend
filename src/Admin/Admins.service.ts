import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
// import { Admin } from '../Auth/auth.model';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, SignUpDto } from '../Auth/auth.dto';
import { Role } from 'src/shared/enums/role.enum';
import { Admin } from './Admins.model';

@Injectable()
export class AdminsService {
  constructor(
    @InjectModel(Admin.name)
    private adminModel: Model<Admin>,
    private jwtService: JwtService,
  ) {}

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
