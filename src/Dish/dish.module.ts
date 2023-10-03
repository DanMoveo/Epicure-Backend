import { Module } from '@nestjs/common';
import { DishesController } from './dishes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DishesService } from 'src/Dish/dishes.service';
import { DishSchema } from 'src/Dish/dish.model';
import { RestaurantSchema } from 'src/Restaurant/restaurant.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Dish', schema: DishSchema }]),
    MongooseModule.forFeature([
      { name: 'Restaurant', schema: RestaurantSchema },
    ]),
  ],
  controllers: [DishesController],
  providers: [DishesService],
})
export class DishesModule {}
