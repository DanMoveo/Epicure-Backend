import { Module } from '@nestjs/common';
import { ChefsController } from './chefs.controller';
import { ChefsService } from './chefs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChefSchema } from './chef.model';
import { RestaurantSchema } from 'src/Restaurant/restaurant.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Chef', schema: ChefSchema },
    ]),
  ],
  controllers: [ChefsController],
  providers: [ChefsService],
  exports: [ChefsService],
})
export class ChefsModule {}
