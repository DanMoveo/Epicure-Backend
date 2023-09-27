import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { RestaurantsService } from '../services/restaurants.service';
import {
  CreateRestaurantDto,
  UpdateRestaurantDto,
} from '../dto/restaurant.dto';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  async addRestaurant(@Body() createRestaurantDto: CreateRestaurantDto) {
    const generatedId =
      await this.restaurantsService.insertRestaurant(createRestaurantDto);
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

  @Get('restaurant')
  async getDishesByRestaurantAndCategory(
    @Query('restaurantId') restaurantId: string,
    @Query('category') category: string,
  ) {
    if (!restaurantId || !category) {
      throw new BadRequestException(
        'Both restaurantId and category are required.',
      );
    }

    const restaurants =
      await this.restaurantsService.getDishesByRestaurantAndCategory(
        restaurantId,
        category,
      );

    return restaurants;
  }

  @Get()
  getRestaurant(@Query('id') resId: string) {
    return this.restaurantsService.getSingleRestaurant(resId);
  }

  @Get('/chefs')
  async getRestaurantsByChefName(@Query('chefName') chefName: string) {
    const restaurants =
      await this.restaurantsService.getRestaurantsByChef(chefName);
    return restaurants;
  }
  
  @Put(':id')
  async updateRestaurant(
    @Query('id') resId: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    return this.restaurantsService.updateRestaurant(resId, updateRestaurantDto);
  }

  @Delete('restaurant')
  async deleteRestaurant(@Query('id') resId: string) {
    return this.restaurantsService.deleteRestaurnt(resId);
  }
}
