// user.dto.ts
import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}

// login.dto.ts
export class LoginDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
