import { Module } from '@nestjs/common';
import { RestaurantsController } from '../controllers/restaurants.controller';
import { RestaurantsService } from '../services/restaurants.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantSchema } from '../models/restaurant.model';
import { DishesModule } from './dish.module';
import { DishSchema } from 'src/models/dish.model';
import { DishesService } from 'src/services/dishes.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Restaurant', schema: RestaurantSchema },
    ]),

    MongooseModule.forFeature([{ name: 'Dish', schema: DishSchema }]),
  ],
  controllers: [RestaurantsController],
  providers: [RestaurantsService,DishesService],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
