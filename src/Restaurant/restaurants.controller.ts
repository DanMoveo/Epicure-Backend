import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Param,
  Query,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  async getAllRestaurants(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('sortBy') sortBy?: 'mostPopular' | 'highestRated',
  ) {
    try {
      console.log(sortBy);
      if (sortBy === 'mostPopular') {
        const arr = await this.restaurantsService.getMostPopularRestaurants();
        console.log(arr);
        return arr;
      }
      return await this.restaurantsService.getRestaurants(page, pageSize);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to get all restaurants');
    }
  }

  @Get('restaurant/:id')
  async getRestaurant(@Param('id') resId: string) {
    try {
      const restaurant =
        await this.restaurantsService.getSingleRestaurant(resId);
      if (!restaurant) {
        throw new BadRequestException('Restaurant not found');
      }
      return restaurant;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to get restaurant');
    }
  }

  @Get('chef')
  async getRestaurantsByChefName(@Query('chefName') chefName: string) {
    try {
      const restaurants =
        await this.restaurantsService.getRestaurantsByChefName(chefName);
      return restaurants;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to get restaurant');
    }
  }

  @Get('restaurant/:id/dishes/')
  async getRestaurantsByCategory(
    @Param('id') resId: string,
    @Query('category') category: string,
  ) {
    try {
      const restaurants =
        await this.restaurantsService.getDishesByRestaurantAndCategory(
          resId,
          category,
        );
      return restaurants;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to get restaurant');
    }
  }
}
