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
    try {
      const generatedId =
        await this.restaurantsService.insertRestaurant(createRestaurantDto);
      return { id: generatedId };
    } catch (error) {
      throw new BadRequestException('Failed to add restaurant');
    }
  }

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

  @Get('restaurant')
  async getRestaurant(@Query('id') resId: string) {
    try {
      const restaurant =
        await this.restaurantsService.getSingleRestaurant(resId);
      return restaurant;
    } catch (error) {
      throw new BadRequestException('Failed to get all restaurants');
    }
  }

  @Get('chef')
  async getRestaurantsByChefName(@Query('chefName') chefName: string) {
    return this.restaurantsService.getRestaurantsByChefName(chefName);
  }

  @Get('restaurant/dishes')
  async getDishesByRestaurantAndCategory(
    @Query('restaurantId') restaurantId: string,
    @Query('category') category: string,
  ) {
    try {
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
    } catch (error) {
      throw new BadRequestException(
        'Failed to get dishes by restaurant and category',
      );
    }
  }

  @Put(':id')
  async updateRestaurant(
    @Query('id') resId: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    try {
      const updatedRestaurant = await this.restaurantsService.updateRestaurant(
        resId,
        updateRestaurantDto,
      );
      if (!updatedRestaurant) {
        throw new BadRequestException('Restaurant not found');
      }
      return updatedRestaurant;
    } catch (error) {
      throw new BadRequestException('Failed to update restaurant');
    }
  }

  @Delete('restaurant')
  async deleteRestaurant(@Query('id') resId: string) {
    try {
      const result = await this.restaurantsService.deleteRestaurnt(resId);

      if (!result) {
        throw new BadRequestException('Restaurant not found');
      }

      return { message: 'Restaurant deleted successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to delete restaurant');
    }
  }
}
