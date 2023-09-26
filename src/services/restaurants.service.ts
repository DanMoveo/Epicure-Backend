import { Injectable, NotFoundException } from '@nestjs/common';
import { Restaurant } from '../models/restaurant.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RestaurantsService {
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
      image,
      name,
      chefName,
      rate,
    });

    const result = await newRestaurant.save();
    return result.id as string;
  }

  async getRestaurants() {
    const restaurants = await this.restaurantModel.find().exec();
    return restaurants.map((res) => this.mapRestaurantToResponse(res));
  }

  async getSingleRestaurant(restaurantId: string) {
    const restaurant = await this.findRestaurant(restaurantId);
    return this.mapRestaurantToResponse(restaurant);
  }

  async getMostPopularRestaurants() {
    const popularRestaurants = await this.restaurantModel
      .find({ rate: { $gte: 4 } })
      .exec();

    return popularRestaurants.map((res) => this.mapRestaurantToResponse(res));
  }

  private async findRestaurant(id: string): Promise<Restaurant> {
    try {
      const restaurant = await this.restaurantModel.findById(id);
      if (!restaurant) {
        throw new NotFoundException('Could not find restaurant.');
      }
      return restaurant;
    } catch (error) {
      throw new NotFoundException('Could not find restaurant.');
    }
  }

  private mapRestaurantToResponse(restaurant: Restaurant) {
    return {
      id: restaurant.id,
      image: restaurant.image,
      name: restaurant.name,
      chefName: restaurant.chefName,
      rate: restaurant.rate,
      dishes: restaurant.dishes,
    };
  }
}
