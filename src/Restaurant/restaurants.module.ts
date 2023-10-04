import { Module } from '@nestjs/common';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantSchema } from './restaurant.model';
import { DishSchema } from 'src/Dish/dish.model';
import { DishesService } from 'src/Dish/dishes.service';
import { ChefSchema } from '../Chef/chef.model';
import { ChefsModule } from '../Chef/chef.module';
import { DishesModule } from 'src/Dish/dish.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Restaurant', schema: RestaurantSchema },
      { name: 'Chef', schema: ChefSchema },
      { name: 'Dish', schema: DishSchema },
    ]),
    ChefsModule,
    DishesModule, 
  ],
  controllers: [RestaurantsController],
  providers: [RestaurantsService, DishesService],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
