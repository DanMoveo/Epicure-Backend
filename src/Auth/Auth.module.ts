// // auth.module.ts
// import { Module } from '@nestjs/common';
// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';
// import { MongooseModule } from '@nestjs/mongoose';
// import { AuthSchema } from './Auth.model';
// import { PassportModule } from '@nestjs/passport';
// import { JwtModule } from '@nestjs/jwt';
// import { ConfigModule, ConfigService } from '@nestjs/config';

// @Module({
//   imports: [
//     PassportModule.register({ defaultStrategy: 'jwt' }),
//     JwtModule.registerAsync({
//       imports: [ConfigModule],
//       useFactory: async (configService: ConfigService) => ({
//         secret: configService.get<string>('JWT_SECRET'),
//         signOptions: {
//           expiresIn: configService.get<string | number>('JWT_EXPIRE'),
//         },
//       }),
//       inject: [ConfigService],
//     }),
//     MongooseModule.forFeature([{ name: 'Auth', schema: AuthSchema }]),
//   ],

//   controllers: [AuthController],
//   providers: [AuthService],
//   exports: [AuthService],

// })
// export class AuthModule {}
