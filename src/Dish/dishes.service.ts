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
    const { image, name, description, price, category, icons, restaurantId } =
      createDishDto;

    try {
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
    } catch (error) {
      throw new Error('Failed to add dish');
    }
  }

  async getDishes() {
    try {
      const dishes = await this.dishModel.find().exec();
      return dishes.map((dish) => this.mapDishToResponse(dish));
    } catch (error) {
      throw new Error('Failed to get all dishes');
    }
  }

  async getSingleDish(dishId: string) {
    try {
      const dish = await this.findDish(dishId);

      if (!dish) {
        throw new Error('Dish not found');
      }

      return this.mapDishToResponse(dish);
    } catch (error) {
      throw new Error('Failed to get dish');
    }
  }

  async getDishesByCategoryAndRestaurant(
    category: string,
    restaurantId: string,
  ) {
    try {
      const dishes = await this.dishModel
        .find({ category, restaurant: restaurantId })
        .exec();

      if (!dishes || dishes.length === 0) {
        throw new Error(
          'Could not find dishes for the specified category and restaurant.',
        );
      }

      return dishes.map((dish) => this.mapDishToResponse(dish));
    } catch (error) {
      throw new Error('Failed to get dishes by category and restaurant');
    }
  }

  async updateDish(dishId: string, updateDishDto: UpdateDishDto) {
    const { image, name, description, price, category, icons } = updateDishDto;

    try {
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
    } catch (error) {
      throw new Error('Failed to update dish');
    }
  }

  async deleteDish(dishId: string) {
    try {
      const result = await this.dishModel.findByIdAndDelete(dishId);

      if (!result) {
        throw new Error('Dish not found');
      }

      return { message: 'Dish deleted successfully' };
    } catch (error) {
      throw new Error('Failed to delete dish');
    }
  }

  private async updateRestaurantWithDish(restaurantId: string, dishId: string) {
    await this.restaurantModel.findByIdAndUpdate(restaurantId, {
      $push: { dishes: dishId },
    });
  }

  private async findDish(id: string): Promise<Dish | null> {
    try {
      const dish = await this.dishModel.findById(id);
      return dish;
    } catch (error) {
      return null;
    }
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
