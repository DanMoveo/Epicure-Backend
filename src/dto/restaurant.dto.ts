// restaurant.dto.ts

import { IsString, IsNumber } from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  image: string;

  @IsString()
  name: string;

  @IsString()
  chefName: string;

  @IsNumber()
  rate: number;
}

export class UpdateRestaurantDto {
  @IsString()
  image: string;

  @IsString()
  name: string;

  @IsString()
  chefName: string;

  @IsNumber()
  rate: number;
}
