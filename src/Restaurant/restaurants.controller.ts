import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  async getAllRestaurants() {
    try {
      const restaurants = await this.restaurantsService.getRestaurants();
      return restaurants;
    } catch (error) {
      throw new BadRequestException('Failed to get all restaurants');
    }
  }

  @Get('mostPopular')
  async getMostPopularRestaurants() {
    try {
      const popularRestaurants =
        await this.restaurantsService.getMostPopularRestaurants();
      return popularRestaurants;
    } catch (error) {
      throw new BadRequestException('Failed to get most popular restaurants');
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
      throw new BadRequestException('Failed to get restaurant');
    }
  }
}
