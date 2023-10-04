// chefs.dto.ts

import { IsString } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  name: string;

  @IsString()
  password: string;
}

export class UpdateAdminDto {
  @IsString()
  name: string;

  @IsString()
  password: string;
}
