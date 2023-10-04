import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { AdminService } from './Admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  async getAllAdmins() {}

  @Get()
  async getAdmin() {}

  @Post()
  async addAdmin() {}

  @Put()
  async updateAdmin() {}

  @Delete()
  async deleteAdmin() {}
}
