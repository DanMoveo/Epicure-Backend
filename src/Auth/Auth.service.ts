
// import {
//     Injectable,
//     UnauthorizedException,
//   } from '@nestjs/common';
//   import { Model } from 'mongoose';
//   import { InjectModel } from '@nestjs/mongoose';
//   import { Auth } from './Auth.model';
//   import * as bcrypt from 'bcrypt';
//   import { JwtService } from '@nestjs/jwt';
//   import { LoginDto, SignUpDto } from './Auth.dto';
//   import { Role } from 'src/shared/enums/role.enum';

// @Injectable()
// export class AuthService {
//     constructor(
//       @InjectModel(Auth.name)
//       private authModel: Model<Auth>,
//       private jwtService: JwtService,
//     ) {}
//     async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
//         const { name, email, password } = signUpDto;
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const defaultRole = [Role.User];
//         const auth = await this.authModel.create({
//           name,
//           email,
//           password: hashedPassword,
//           roles: defaultRole,
//         });
//         const token = this.jwtService.sign(
//           {
//             id: auth._id,
//             name: auth.name,
//             email: auth.email,
//             roles: auth.roles,
//           },
//           { secret: 'dandan' },
//         );
//         return { token };
//       }
    
//       async login(loginDto: LoginDto): Promise<{ token: string }> {
//         const { email, password } = loginDto;
//         const auth = await this.authModel.findOne({ email });
//         if (!auth) {
//           throw new UnauthorizedException('Invaild email or password');
//         }
//         const isPasswordMatched = await bcrypt.compare(password, auth.password);
//         if (!isPasswordMatched) {
//           throw new UnauthorizedException('Invaild  password');
//         }
//         console.log(`User role: ${auth.roles}`);
//         const token = this.jwtService.sign(
//           {
//             id: auth._id,
//             name: auth.name,
//             email: auth.email,
//             roles: auth.roles,
//           },
//           { secret: 'dandan' },
//         );
//         return { token };
//       }
// }
