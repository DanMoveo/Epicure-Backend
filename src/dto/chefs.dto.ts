// chefs.dto.ts

import { IsString, IsNumber, ArrayNotEmpty, IsArray } from 'class-validator';

export class CreateChefDto {
  @IsString()
  image: string;

  @IsString()
  name: string;

  @IsArray()
  restaurantIds: string[];
}

export class UpdateChefDto {
  @IsString()
  image: string;

  @IsString()
  name: string;

  @IsArray()
  restaurantIds: string[];
}
