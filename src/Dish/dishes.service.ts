import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Dish } from './dish.model';
import { Restaurant } from '../Restaurant/restaurant.model';
import { CreateDishDto, UpdateDishDto } from './dishes.dto';

@Injectable()
export class DishesService {
  constructor(
    @InjectModel('Dish') private readonly dishModel: Model<Dish>,
    @InjectModel('Restaurant')
    private readonly restaurantModel: Model<Restaurant>,
  ) {}

  async insertDish(createDishDto: CreateDishDto) {
    const { image, name, description, price, category, icons } = createDishDto;
    const newDish = new this.dishModel({
      image,
      name,
      description,
      price,
      category,
      icons,
    });
    const result = await newDish.save();
    const dishId = result.id;
    this.updateRestaurantWithDish(dishId);
    return dishId as string;
  }

  async getDishes() {
    const dishes = await this.dishModel.find().exec();
    return dishes.map((dish) => this.mapDishToResponse(dish));
  }

  async getSingleDish(dishId: string) {
    const dish = await this.findDish(dishId);
    if (!dish) {
      throw new Error('Dish not found');
    }
    return this.mapDishToResponse(dish);
  }

  async getDishesByCategoryAndRestaurant(
    category: string,
    restaurantId: string,
  ) {
    const dishes = await this.dishModel
      .find({ category, restaurant: restaurantId })
      .exec();
    if (!dishes || dishes.length === 0) {
      throw new Error(
        'Could not find dishes for the specified category and restaurant.',
      );
    }
    return dishes.map((dish) => this.mapDishToResponse(dish));
  }

  async updateDish(dishId: string, updateDishDto: UpdateDishDto) {
    const { image, name, description, price, category, icons } = updateDishDto;
      const updatedDish = await this.findDish(dishId);
      if (!updatedDish) {
        throw new Error('Dish not found');
      }
      updatedDish.image = image;
      updatedDish.name = name;
      updatedDish.description = description;
      updatedDish.price = price;
      updatedDish.category = category;
      updatedDish.icons = icons;
      await updatedDish.save();
      return this.mapDishToResponse(updatedDish);
  }

  async deleteDish(dishId: string) {
      const result = await this.dishModel.findByIdAndDelete(dishId);
      if (!result) {
        throw new Error('Dish not found');
      }
      return { message: 'Dish deleted successfully' };
  }

  private async updateRestaurantWithDish(dishId: string) {
    await this.restaurantModel.findByIdAndUpdate(dishId, {
      $push: { dishes: dishId },
    });
  }

  private async findDish(id: string): Promise<Dish | null> {
      const dish = await this.dishModel.findById(id);
      return dish;
  }

  private mapDishToResponse(dish: Dish) {
    return {
      id: dish.id,
      image: dish.image,
      name: dish.name,
      description: dish.description,
      price: dish.price,
      category: dish.category,
      icons: dish.icons,
    };
  }
}
