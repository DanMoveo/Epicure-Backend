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
    console.log('Received restaurantId:', restaurantId);

    const restaurant = await this.restaurantModel.findById(restaurantId);

    if (!restaurant) {
      console.log('Restaurant not found.');
      throw new NotFoundException('Could not find restaurant.');
    }

    console.log('Restaurant found:', restaurant);

    const newDish = new this.dishModel({
      image: image,
      name: name,
      description: description,
      price: price,
      category: category,
      icons: icons,
      restaurant: restaurantId,
    });
    console.log('Creating new Dish:', newDish);

    const result = await newDish.save();
    console.log('Dish saved:', result);

    const dishId = result.id;
    await this.restaurantModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(restaurantId),
      {
        $push: { dishes: dishId },
      },
    );

    console.log('Restaurant updated with new Dish.');

    return dishId as string;
  }

  async getDishes() {
    const dishes = await this.dishModel.find().exec();
    return dishes.map((dish) => ({
      id: dish.id,
      image: dish.image,
      name: dish.name,
      description: dish.description,
      price: dish.price,
      category: dish.category,
      icons: dish.icons,
      restaurantId: dish.restaurant,
    }));
  }

  async getSingleDish(dishId: string) {
    const dish = await this.findDish(dishId);
    return dish;
  }

  private async findDish(id: string): Promise<Dish> {
    let dish: Dish;
    try {
      dish = await this.dishModel.findById(id);
    } catch (error) {
      throw new NotFoundException('Could not find dish.');
    }
    if (!dish) {
      throw new NotFoundException('Could not find dish.');
    }
    return dish.toObject();
  }
}
