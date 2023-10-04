import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { AdminsController } from './Admins.controller';
import { AdminSchema } from './Admin.model';
import { AdminsService } from './Admins.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Admin', schema: AdminSchema }]),
  ],
  controllers: [AdminsController],
  providers: [AdminsService],
  exports: [AdminsService],
})
export class AdminModule {}
