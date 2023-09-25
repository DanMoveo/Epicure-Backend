import { Module } from '@nestjs/common';
import { RestaurantsController } from '../controllers/restaurants.controller';
import { RestaurantsService } from '../services/restaurants.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantSchema } from '../models/restaurant.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Restaurant', schema: RestaurantSchema },
    ]),
  ],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
  exports: [RestaurantsService], 
})
export class RestaurantsModule {}
