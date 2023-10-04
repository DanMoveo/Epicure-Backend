import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Restaurant } from './restaurant.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DishesService } from '../Dish/dishes.service';
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
    const { image, name, chefId, rate } = createRestaurantDto;

    try {
      const newRestaurant = new this.restaurantModel({
        image,
        name,
        chefId,
        rate,
      });

      const result = await newRestaurant.save();
      return result.id as string;
    } catch (error) {
      throw new BadRequestException('Failed to add restaurant');
    }
  }

  async getRestaurants() {
    try {
      const restaurants = await this.restaurantModel
        .find()
        .populate('chefId', 'name')
        .exec();
      return restaurants.map((res) => this.mapRestaurantToResponse(res));
    } catch (error) {
      throw new BadRequestException('Failed to get all restaurants');
    }
  }

  async getRestaurantsByChefName(chefName: string) {
    try {
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
    } catch (error) {
      throw new BadRequestException('Failed to get all restaurants');
    }
  }

  async getSingleRestaurant(restaurantId: string) {
    try {
      const restaurant = await this.restaurantModel
        .findById(restaurantId)
        .populate('chefId', 'name')
        .populate('dishes')
        .exec();

      if (!restaurant) {
        throw new Error('Restaurant not found');
      }

      return this.mapRestaurantToResponse(restaurant);
    } catch (error) {
      throw new InternalServerErrorException('Failed to get restaurant', error);
    }
  }

  async getDishesByRestaurantAndCategory(restaurantId: string, category: string) {
    try {
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
    } catch (error) {
      throw new InternalServerErrorException('Failed to get restaurant', error);
    }
  }
  

  async getMostPopularRestaurants() {
    try {
      const popularRestaurants = await this.restaurantModel
        .find({ rate: { $gte: 4 } })
        .populate('chefId', 'name')
        .exec();

      return popularRestaurants.map((res) => this.mapRestaurantToResponse(res));
    } catch (error) {
      throw new BadRequestException('Failed to get most popular restaurants');
    }
  }

  async updateRestaurant(
    resId: string,
    updateRestaurantDto: UpdateRestaurantDto,
  ) {
    const { image, name, chefId, rate } = updateRestaurantDto;

    try {
      const updatedRestaurant = await this.findRestaurant(resId);

      if (!updatedRestaurant) {
        throw new BadRequestException('Restaurant not found');
      }

      updatedRestaurant.image = image;
      updatedRestaurant.name = name;
      updatedRestaurant.chefId = new Types.ObjectId(chefId) as any;
      updatedRestaurant.rate = rate;

      await updatedRestaurant.save();
      return this.mapRestaurantToResponse(updatedRestaurant);
    } catch (error) {
      throw new BadRequestException('Failed to update restaurant');
    }
  }

  async deleteRestaurnt(resId: string) {
    try {
      const result = await this.restaurantModel.findByIdAndDelete(resId);

      if (!result) {
        throw new BadRequestException('Restaurant not found');
      }

      return { message: 'Restaurant deleted successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to delete restaurant');
    }
  }

  private async findRestaurant(id: string): Promise<Restaurant | null> {
    try {
      const restaurant = await this.restaurantModel.findById(id);
      return restaurant;
    } catch (error) {
      return null;
    }
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