import { Module } from '@nestjs/common';
import { ChefsController } from '../controllers/chefs.controller';
import { ChefsService } from '../services/chefs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChefSchema } from '../models/chef.model';
import { RestaurantSchema } from 'src/models/restaurant.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Chef', schema: ChefSchema },
      { name: 'Restaurant', schema: RestaurantSchema },
    ]),
  ],
  controllers: [ChefsController],
  providers: [ChefsService],
  exports: [ChefsService],
})
export class ChefsModule {}
