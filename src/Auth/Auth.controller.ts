// import {
//   BadRequestException,
//   Body,
//   Controller,
//   Post,
// } from '@nestjs/common';
// import { LoginDto, SignUpDto } from './Auth.dto';
// import { AuthService } from './Auth.service';

// @Controller('auth')
// // @UseGuards(RolesGuard)
// // TODO: Activate this guard & export the 'login' and 'register' to an outsidew service in a module named 'Auth'
// // @Roles(Role.SuperAdmin)
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   @Post('/signup')
//   async signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
//     try {
//       const result = await this.authService.signUp(signUpDto);
//       return result;
//     } catch (error) {
//       console.error(error);
//       throw new BadRequestException(error.message || 'Failed to sign up');
//     }
//   }

//   @Post('/login')
//   async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
//     console.log('check1');
//     try {
//       console.log('check2');
//       const result = await this.authService.login(loginDto);
//       return result;
//     } catch (error) {
//       console.error(error);
//       throw new BadRequestException(error.message || 'Failed to log in');
//     }
//   }
// }
