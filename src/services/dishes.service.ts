import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dish } from '../models/dish.model';
import { Restaurant } from '../models/restaurant.model';
import { CreateDishDto, UpdateDishDto } from '../dto/dishes.dto';

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

    {
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
    if (!dishes || dishes.length === 0) {
      throw new NotFoundException(
        'Could not find dishes for the specified category and restaurant.',
      );
    }
    return dishes.map((dish) => this.mapDishToResponse(dish));
  }

  async updateDish(dishId: string, updateDishDto: UpdateDishDto) {
    const { image, name, description, price, category, icons, restaurantId } =
      updateDishDto;

    {
      const updatedDish = await this.findDish(dishId);
      updatedDish.image = image;
      updatedDish.name = name;
      updatedDish.description = description;
      updatedDish.price = price;
      updatedDish.category = category;
      updatedDish.icons = icons;

      await updatedDish.save();
      return this.mapDishToResponse(updatedDish);
    }
  }

  async deleteDish(dishId: string) {
    await this.dishModel.findByIdAndDelete(dishId);
    return { message: 'Dish deleted successfully' };
  }

  private async updateRestaurantWithDish(restaurantId: string, dishId: string) {
    await this.restaurantModel.findByIdAndUpdate(restaurantId, {
      $push: { dishes: dishId },
    });
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
