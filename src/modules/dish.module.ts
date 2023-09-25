import { Module } from '@nestjs/common';
import { DishesController } from '../controllers/dishes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DishesService } from 'src/services/dishes.service';
import { RestaurantsModule } from './restaurants.module';
import { DishSchema } from 'src/models/dish.model';
import { RestaurantSchema } from 'src/models/restaurant.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Dish', schema: DishSchema }]),
    MongooseModule.forFeature([{ name: 'Restaurant', schema: RestaurantSchema }]),
  ],
  controllers: [DishesController],
  providers: [DishesService],
})
export class DishesModule {}
