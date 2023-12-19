import { Controller, Get, BadRequestException, Param } from '@nestjs/common';
import { DishesService } from 'src/Dish/dishes.service';

@Controller('dishes')
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  @Get()
  async getAllDishes() {
    try {
      const dishes = await this.dishesService.getDishes();
      return dishes;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to get all dishes');
    }
  }

  @Get('dish/:id')
  async getDish(@Param('id') dishId: string) {
    try {
      const dish = await this.dishesService.getSingleDish(dishId);

      if (!dish) {
        throw new BadRequestException('Dish not found');
      }

      return dish;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to get dish');
    }
  }
}
