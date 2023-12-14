import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Restaurant } from './restaurant.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRestaurantDto, UpdateRestaurantDto } from './restaurant.dto';
import { Types } from 'mongoose';
import { Dish } from '../Dish/dish.model'; // Import the Dish model

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel('Restaurant')
    private readonly restaurantModel: Model<Restaurant>,
    @InjectModel('Dish')
    private readonly dishModel: Model<Dish>,
  ) {}

  async insertRestaurant(createRestaurantDto: CreateRestaurantDto) {
    const { image, name, chefId, rate, dishes } = createRestaurantDto;
    const newRestaurant = new this.restaurantModel({
      image,
      name,
      chefId,
      rate,
      dishes,
    });
    const result = await newRestaurant.save();
    return result.id as string;
  }

  async getRestaurants() {
    const restaurants = await this.restaurantModel
      .find()
      .populate('chefId', 'name')
      .exec();
    return restaurants.map((res) => this.mapRestaurantToResponse(res));
  }

  async getRestaurantsByChefName(chefName: string) {
    const restaurants = await this.restaurantModel
      .find()
      .populate('chefId', 'name')
      .exec();
    const filteredRestaurants = [];
    for (let i = 0; i < restaurants.length; i++) {
      if (restaurants[i].chefId['name'] === chefName) {
        filteredRestaurants.push({
          image: restaurants[i].image,
          name: restaurants[i].name,
        });
      }
    }

    return filteredRestaurants;
  }

  async getSingleRestaurant(restaurantId: string) {
    const restaurant = await this.restaurantModel
      .findById(restaurantId)
      .populate('chefId', 'name')
      .populate('dishes')
      .exec();
    if (!restaurant) {
      throw new Error('Restaurant not found');
    }
    return this.mapRestaurantToResponse(restaurant);
  }

  async getDishesByRestaurantAndCategory(
    restaurantId: string,
    category: string,
  ) {
    const restaurant = await this.restaurantModel
      .findById(restaurantId)
      .populate('dishes')
      .select('dishes')
      .exec();
    if (!restaurant) {
      throw new Error('Restaurant not found');
    }
    const filteredDishes = await this.dishModel.find({
      _id: { $in: restaurant.dishes },
      category: category,
    });
    return filteredDishes;
  }

  async getMostPopularRestaurants() {
    const popularRestaurants = await this.restaurantModel
      .find({ rate: { $gte: 4 } })
      .populate('chefId', 'name')
      .exec();
    return popularRestaurants.map((res) => this.mapRestaurantToResponse(res));
  }

  async updateRestaurant(
    resId: string,
    updateRestaurantDto: UpdateRestaurantDto,
  ) {
    const { image, name, chefId, rate, dishes } = updateRestaurantDto;
      const updatedRestaurant = await this.findRestaurant(resId);
      if (!updatedRestaurant) {
        throw new BadRequestException('Restaurant not found');
      }
      updatedRestaurant.image = image;
      updatedRestaurant.name = name;
      updatedRestaurant.chefId = new Types.ObjectId(chefId) as any;
      updatedRestaurant.rate = rate;
      updatedRestaurant.dishes = dishes.map((dishId) => dishId.toString());
      await updatedRestaurant.save();
      return this.mapRestaurantToResponse(updatedRestaurant);
  }

  async deleteRestaurnt(resId: string) {
      const result = await this.restaurantModel.findByIdAndDelete(resId);
      if (!result) {
        throw new BadRequestException('Restaurant not found');
      }
      return { message: 'Restaurant deleted successfully' };
  }

  private async findRestaurant(id: string): Promise<Restaurant | null> {
      const restaurant = await this.restaurantModel.findById(id);
      return restaurant;
  }

  private mapRestaurantToResponse(restaurant: Restaurant) {
    return {
      id: restaurant.id,
      image: restaurant.image,
      name: restaurant.name,
      chefId: restaurant.chefId,
      rate: restaurant.rate,
      dishes: restaurant.dishes,
    };
  }
}
