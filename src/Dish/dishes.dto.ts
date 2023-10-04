// dishes.dto.ts

import { IsString, ArrayNotEmpty, IsArray, IsNumber } from 'class-validator';

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

}
