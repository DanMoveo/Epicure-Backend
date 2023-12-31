import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantsModule } from './modules/restaurants.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DishesModule } from './modules/dish.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://dang:shinLsPdP8MQWCCn@cluster0.pfyqhsq.mongodb.net/?retryWrites=true&w=majority',
    ),
    RestaurantsModule,
    DishesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
