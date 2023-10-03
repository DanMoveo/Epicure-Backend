import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  BadRequestException,
  Param,
} from '@nestjs/common';
import { DishesService } from 'src/Dish/dishes.service';
import { CreateDishDto, UpdateDishDto } from './dishes.dto';

@Controller('dishes')
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  @Post()
  async addDish(@Body() createDishDto: CreateDishDto) {
    try {
      const generatedId = await this.dishesService.insertDish(createDishDto);
      return { id: generatedId };
    } catch (error) {
      throw new BadRequestException('Failed to add dish');
    }
  }

  @Get()
  async getAllDishes() {
    try {
      const dishes = await this.dishesService.getDishes();
      return dishes;
    } catch (error) {
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
      throw new BadRequestException('Failed to get dish');
    }
  }
  

  @Put('dish')
  async updateDish(
    @Query('id') dishId: string,
    @Body() updateDishDto: UpdateDishDto,
  ) {
    try {
      const updatedDish = await this.dishesService.updateDish(
        dishId,
        updateDishDto,
      );

      if (!updatedDish) {
        throw new BadRequestException('Dish not found');
      }

      return updatedDish;
    } catch (error) {
      throw new BadRequestException('Failed to update dish');
    }
  }

  @Delete('dish')
  async deleteDish(@Query('id') dishId: string) {
    try {
      const result = await this.dishesService.deleteDish(dishId);

      if (!result) {
        throw new BadRequestException('Dish not found');
      }

      return { message: 'Dish deleted successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to delete dish');
    }
  }
}
