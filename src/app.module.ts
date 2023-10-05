
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core'; 

import { RestaurantsModule } from './Restaurant/restaurants.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DishesModule } from './Dish/dish.module';
import { ChefsModule } from './Chef/chef.module';
import { UsersModule } from './User/users.module';
import { AdminModule } from './Admin/Admins.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';


@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      'mongodb+srv://dang:shinLsPdP8MQWCCn@cluster0.pfyqhsq.mongodb.net/?retryWrites=true&w=majority',
    ),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    RestaurantsModule,
    DishesModule,
    ChefsModule,
    UsersModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },],
})
export class AppModule {}