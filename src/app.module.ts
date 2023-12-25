import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

import { RestaurantsModule } from './Restaurant/restaurants.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DishesModule } from './Dish/dish.module';
import { ChefsModule } from './Chef/chef.module';
import { UsersModule } from './User/users.module';
import { AdminModule } from './Admin/Admins.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtMiddleware } from './shared/middleware/jwtMiddleware';
import { JwtModule } from '@nestjs/jwt';
// import { AuthModule } from './Auth/auth.module';
import { AuthModule } from './Auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      'mongodb+srv://dang:shinLsPdP8MQWCCn@cluster0.pfyqhsq.mongodb.net/?retryWrites=true&w=majority',
    ),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    RestaurantsModule,
    DishesModule,
    ChefsModule,
    UsersModule,
    AdminModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    JwtMiddleware,
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('admins/*');
  }
}
