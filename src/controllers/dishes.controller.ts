import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DishesService } from 'src/services/dishes.service';

@Controller('dishes')
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  @Post()
  async addDish(
    @Body('image') dishImage: string,
    @Body('name') dishName: string,
    @Body('description') dishDescription: string,
    @Body('price') dishPrice: number,
    @Body('category') dishCategory: string,
    @Body('icons') dishIcons: string[],
    @Body('restaurantId') restaurantId: string,
  ) {
    const generatedId = await this.dishesService.insertDish(
      dishImage,
      dishName,
      dishDescription,
      dishPrice,
      dishCategory,
      dishIcons,
      restaurantId,
    );
    return { id: generatedId };
  }

  @Get()
  async getAllDishes() {
    const dishes = await this.dishesService.getDishes();
    return dishes;
  }

  @Get('breakfast/:restaurantId')
  async getBreakfastDishesByRestaurant(@Param('restaurantId') restaurantId: string) {
    const breakfastDishes = await this.dishesService.getDishesByCategoryAndRestaurant('Breakfast', restaurantId);
    return breakfastDishes;
  }

  @Get('dinner/:restaurantId')
  async getDinnerDishesByRestaurant(@Param('restaurantId') restaurantId: string) {
    const dinnerDishes = await this.dishesService.getDishesByCategoryAndRestaurant('Dinner', restaurantId);
    return dinnerDishes;
  }

  @Get('lunch/:restaurantId')
  async getLunchDishesByRestaurant(@Param('restaurantId') restaurantId: string) {
    const lunchDishes = await this.dishesService.getDishesByCategoryAndRestaurant('Lunch', restaurantId);
    return lunchDishes;
  }

  @Get(':id')
  getDish(@Param('id') dishId: string) {
    return this.dishesService.getSingleDish(dishId);
  }
}
