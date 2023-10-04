import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantsModule } from './Restaurant/restaurants.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DishesModule } from './Dish/dish.module';
import { ChefsModule } from './Chef/chef.module';
import { UsersModule } from './User/users.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://dang:shinLsPdP8MQWCCn@cluster0.pfyqhsq.mongodb.net/?retryWrites=true&w=majority',
    ),
    RestaurantsModule,
    DishesModule,
    ChefsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
