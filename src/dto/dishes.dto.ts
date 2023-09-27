// src/dishes/dishes.dto.ts

import { IsString, IsNumber, ArrayNotEmpty, IsArray } from 'class-validator';

export class CreateDishDto {
  @IsString()
  image: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsString()
  category: string;

  @IsArray()
  @ArrayNotEmpty()
  icons: string[];

  @IsString()
  restaurantId: string;
}

export class UpdateDishDto {
  @IsString()
  image: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsString()
  category: string;

  @IsArray()
  @ArrayNotEmpty()
  icons: string[];

  @IsString()
  restaurantId: string;
}
