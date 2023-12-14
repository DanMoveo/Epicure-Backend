// restaurant.dto.ts

import { IsString, IsNumber, IsArray } from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  image: string;

  @IsString()
  name: string;

  @IsString()
  chefId: string;

  @IsNumber()
  rate: number;

  @IsArray()
  dishes: string[];
}

export class UpdateRestaurantDto {
  @IsString()
  image: string;

  @IsString()
  name: string;

  @IsString()
  chefId: string;

  @IsNumber()
  rate: number;

  @IsArray()
  dishes: string[];
}
