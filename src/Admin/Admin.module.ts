import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './Admin.controller';
import { AdminSchema } from './Admin.model';
import { AdminService } from './Admin.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Admin', schema: AdminSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
