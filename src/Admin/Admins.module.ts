import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminSchema } from './admin.model';
import { RestaurantsModule } from 'src/Restaurant/restaurants.module'; // Import the RestaurantsModule
import { AdminsController } from './Admins.controller';
import { AdminsService } from './Admins.service';
import { DishesModule } from 'src/Dish/dish.module';
import { ChefsModule } from 'src/Chef/chef.module';
import { UsersModule } from 'src/User/users.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string | number>('JWT_EXPIRE'),
        },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: 'Admin', schema: AdminSchema }]),
    DishesModule,
    ChefsModule,
    RestaurantsModule,
    UsersModule,
  ],
  controllers: [AdminsController],
  providers: [AdminsService],
  exports: [AdminsService],
})
export class AdminModule {}
