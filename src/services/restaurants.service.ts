import { Injectable, NotFoundException } from '@nestjs/common';
import { Restaurant } from '../models/restaurant.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DishesService } from './dishes.service';
import { CreateRestaurantDto, UpdateRestaurantDto } from '../dto/restaurant.dto';



@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel('Restaurant')
    private readonly restaurantModel: Model<Restaurant>,
    private readonly dishesService: DishesService,
  ) {}

  async insertRestaurant(createRestaurantDto: CreateRestaurantDto) {
    const { image, name, chefName, rate } = createRestaurantDto; {
      const newRestaurant = new this.restaurantModel({
        image,
        name,
        chefName,
        rate,
      });

      const result = await newRestaurant.save();
      return result.id as string;
    }
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

  async updateRestaurant(resId: string, updateRestaurantDto: UpdateRestaurantDto) {
    const { image, name, chefName, rate } = updateRestaurantDto;
    {
      const updatedRestaurant = await this.findRestaurant(resId);
      updatedRestaurant.image = image;
      updatedRestaurant.name = name;
      updatedRestaurant.chefName = chefName;
      updatedRestaurant.rate = rate;

      await updatedRestaurant.save();
      return this.mapRestaurantToResponse(updatedRestaurant);
    }
  }
  async deleteRestaurnt(resId: string) {
    await this.restaurantModel.findByIdAndDelete(resId);
    return { message: 'Dish deleted successfully' };
  }

  private async findRestaurant(id: string): Promise<Restaurant> {
    try {
      const restaurant = await this.restaurantModel.findById(id);
      if (!restaurant) {
        throw new NotFoundException('Could not find restaurant2.');
      }
      return restaurant;
    } catch (error) {
      throw new NotFoundException('Could not find restaurant3.');
    }
  }

  async getDishesByRestaurantAndCategory(
    restaurantId: string,
    category: string,
  ) {
    const restaurant = await this.findRestaurant(restaurantId);

    const dishes = await this.dishesService.getDishesByCategoryAndRestaurant(
      category,
      restaurantId,
    );

    return dishes;
  }

  async getRestaurantsByChef(chefName: string) {
    const restaurants = await this.restaurantModel
      .find({ chefName: { $regex: new RegExp(chefName, 'i') } })
      .exec();

    return restaurants.map((res) => this.mapRestaurantToResponse(res));
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
