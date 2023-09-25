import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RestaurantsService } from '../services/restaurants.service';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  async addRestaurants(
    @Body('image') resImage: string,
    @Body('name') resName: string,
    @Body('chefName') resChef: string,
    @Body('rate') resRate: number,
  ) {
    const generatedId = await this.restaurantsService.insertRestaurant(
      resImage,
      resName,
      resChef,
      resRate,
    );
    return { id: generatedId };
  }

  @Get()
  async getAllRestaurants() {
    const restaurants = await this.restaurantsService.getRestaurants();
    return restaurants;
  }

  @Get('mostPopular')
  async getMostPopularRestaurants() {
    const popularRestaurants =
      await this.restaurantsService.getMostPopularRestaurants();
    return popularRestaurants;
  }

  @Get(':id')
  getRestaurant(@Param('id') resId: string) {
    return this.restaurantsService.getSingleRestaurant(resId);
  }
}
