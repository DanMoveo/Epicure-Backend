import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { DishesService } from 'src/services/dishes.service';
import { CreateDishDto, UpdateDishDto } from '../dto/dishes.dto';

@Controller('dishes')
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  @Post()
  async addDish(@Body() createDishDto: CreateDishDto) {
    const generatedId = await this.dishesService.insertDish(createDishDto);
    return { id: generatedId };
  }

  @Get()
  async getAllDishes() {
    const dishes = await this.dishesService.getDishes();
    return dishes;
  }

  @Get('dish')
  getDish(@Query('id') dishId: string) {
    return this.dishesService.getSingleDish(dishId);
  }

  @Put('dish')
  async updateDish(
    @Query('id') dishId: string,
    @Body() updateDishDto: UpdateDishDto,
  ) {
    return this.dishesService.updateDish(dishId, updateDishDto);
  }

  @Delete('dish')
  async deleteDish(@Query('id') dishId: string) {
    return this.dishesService.deleteDish(dishId);
  }
}
