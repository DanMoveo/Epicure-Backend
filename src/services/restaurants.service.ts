import { Injectable, NotFoundException } from '@nestjs/common';

import { Restaurant } from '../models/restaurant.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RestaurantsService {
  private restaurants: Restaurant[] = [];

  constructor(
    @InjectModel('Restaurant')
    private readonly restaurantModel: Model<Restaurant>,
  ) {}

  async insertRestaurant(
    image: string,
    name: string,
    chefName: string,
    rate: number,
  ) {
    const newRestaurant = new this.restaurantModel({
      image: image,
      name: name,
      chefName: chefName,
      rate: rate,
    });
    const result = await newRestaurant.save();
    console.log(result);
    return result.id as string;
  }

  async getRestaurants() {
    const restaurants = await this.restaurantModel.find().exec();
    return restaurants.map((res) => ({
      id: res.id,
      image: res.image,
      name: res.name,
      chefName: res.chefName,
      rate: res.rate,
      dishes: res.dishes,
    }));
  }

  async getSingleRestaurant(restaurantId: string) {
    const restaurant = await this.restaurantModel
      .findById(restaurantId)
      .populate('dishes')
      .exec();
    return restaurant;
  }

  private async findRestaurant(id: string): Promise<Restaurant> {
    let restaurant;
    try {
      restaurant = await this.restaurantModel.findById(id);
    } catch (error) {
      throw new NotFoundException('coulnd not find restaurant.');
    }
    if (!restaurant) {
      throw new NotFoundException('coulnd not find restaurant.');
    }
    return restaurant.toObject();
  }

  async getMostPopularRestaurants() {
    const popularRestaurants = await this.restaurantModel
      .find({ rate: { $gte: 4 } })
      .exec();

    return popularRestaurants.map((res) => ({
      id: res.id,
      image: res.image,
      name: res.name,
      chefName: res.chefName,
      rate: res.rate,
    }));
  }
}
