import { Injectable, NotFoundException } from '@nestjs/common';
import { Dish } from '../models/dish.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Restaurant } from 'src/models/restaurant.model';
import mongoose from 'mongoose';

@Injectable()
export class DishesService {
  constructor(
    @InjectModel('Dish')
    private readonly dishModel: Model<Dish>,
    @InjectModel('Restaurant')
    private readonly restaurantModel: Model<Restaurant>,
  ) {}

  async insertDish(
    image: string,
    name: string,
    description: string,
    price: number,
    category: string,
    icons: string[],
    restaurantId: string,
  ) {
    const restaurant = await this.findRestaurantById(restaurantId);

    const newDish = new this.dishModel({
      image,
      name,
      description,
      price,
      category,
      icons,
      restaurant: restaurantId,
    });

    const result = await newDish.save();
    const dishId = result.id;

    await this.updateRestaurantWithDish(restaurantId, dishId);

    return dishId as string;
  }

  async getDishes() {
    const dishes = await this.dishModel.find().exec();
    return dishes.map((dish) => this.mapDishToResponse(dish));
  }

  async getSingleDish(dishId: string) {
    const dish = await this.findDish(dishId);
    return this.mapDishToResponse(dish);
  }

  async getDishesByCategoryAndRestaurant(
    category: string,
    restaurantId: string,
  ) {
    const dishes = await this.dishModel
      .find({ category, restaurant: restaurantId })
      .exec();

    return dishes.map((dish) => this.mapDishToResponse(dish));
  }

  private async findRestaurantById(restaurantId: string) {
    const restaurant = await this.restaurantModel.findById(restaurantId);
    if (!restaurant) {
      throw new NotFoundException('Could not find restaurant.');
    }
    return restaurant;
  }

  private async updateRestaurantWithDish(restaurantId: string, dishId: string) {
    await this.restaurantModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(restaurantId),
      {
        $push: { dishes: dishId },
      },
    );
  }

  private async findDish(id: string): Promise<Dish> {
    const dish = await this.dishModel.findById(id);
    if (!dish) {
      throw new NotFoundException('Could not find dish.');
    }
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
      restaurantId: dish.restaurant,
    };
  }
}
