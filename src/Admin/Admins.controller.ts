import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AdminsService } from './Admins.service';
import { RestaurantsService } from '../Restaurant/restaurants.service';
import {
  CreateRestaurantDto,
  UpdateRestaurantDto,
} from '../Restaurant/restaurant.dto';
import { Admin } from './admin.model';
import { LoginDto, SignUpDto } from './Admin.dto';
import { ChefsService } from 'src/Chef/chefs.service';
import { UserService } from 'src/User/user.service';
import { CreateDishDto, UpdateDishDto } from 'src/Dish/dishes.dto';
import { CreateChefDto, UpdateChefDto } from 'src/Chef/chefs.dto';
import { CreateUserDto } from 'src/User/user.dto';
import { DishesService } from 'src/Dish/dishes.service';
import { Role } from 'src/enums/role.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('admins')
@UseGuards(RolesGuard)
export class AdminsController {
  constructor(
    private readonly dishesService: DishesService,
    private readonly adminService: AdminsService,
    private readonly restaurantsService: RestaurantsService,
    private readonly chefsService: ChefsService,
    private readonly userService: UserService,
  ) {}

  @Post('/signup')
  signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    console.log('SignUp method called');
    return this.adminService.signUp(signUpDto);
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    console.log('Login method called');
    console.log();
    return this.adminService.login(loginDto);
  }

  @Get(':id')
  async getAdmin(@Param('id') id: string): Promise<Admin | null> {
    return this.adminService.getAdminById(id);
  }

  @Post()
  async addAdmin(
    @Body() adminData: { name: string; password: string },
  ): Promise<Admin> {
    return this.adminService.addAdmin(adminData);
  }

  @Put(':id')
  async updateAdmin(
    @Param('id') id: string,
    @Body() adminData: { name: string; password: string },
  ): Promise<Admin | null> {
    return this.adminService.updateAdmin(id, adminData);
  }

  @Delete(':id')
  async deleteAdmin(@Param('id') id: string): Promise<boolean> {
    return this.adminService.deleteAdmin(id);
  }

  @Post('restaurants')
  @Roles(Role.SuperAdmin)
  async addRestaurant(@Body() createRestaurantDto: CreateRestaurantDto) {
    try {
      const generatedId =
        await this.restaurantsService.insertRestaurant(createRestaurantDto);
      return { id: generatedId };
    } catch (error) {
      throw new BadRequestException('Failed to add restaurant');
    }
  }

  @Put('restaurants/:restaurantId')
  async updateRestaurant(
    @Param('restaurantId') restaurantId: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    try {
      const updatedRestaurant = await this.restaurantsService.updateRestaurant(
        restaurantId,
        updateRestaurantDto,
      );
      if (!updatedRestaurant) {
        throw new BadRequestException('Restaurant not found');
      }
      return updatedRestaurant;
    } catch (error) {
      throw new BadRequestException('Failed to update restaurant');
    }
  }

  @Delete('restaurants/:restaurantId')
  async deleteRestaurant(@Param('restaurantId') restaurantId: string) {
    try {
      const result =
        await this.restaurantsService.deleteRestaurnt(restaurantId);
      if (!result) {
        throw new BadRequestException('Restaurant not found');
      }
      return { message: 'Restaurant deleted successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to delete restaurant');
    }
  }

  @Post('dishes')
  async addDish(@Body() createDishDto: CreateDishDto) {
    try {
      const generatedId = await this.dishesService.insertDish(createDishDto);
      return { id: generatedId };
    } catch (error) {
      throw new BadRequestException('Failed to add dish');
    }
  }

  @Put('dishes/:dishId')
  async updateDish(
    @Param('dishId') dishId: string,
    @Body() updateDishDto: UpdateDishDto,
  ) {
    try {
      const updatedDish = await this.dishesService.updateDish(
        dishId,
        updateDishDto,
      );

      if (!updatedDish) {
        throw new BadRequestException('Dish not found');
      }

      return updatedDish;
    } catch (error) {
      throw new BadRequestException('Failed to update dish');
    }
  }

  @Delete('dishes/:dishId')
  async deleteDish(@Param('dishId') dishId: string) {
    try {
      const result = await this.dishesService.deleteDish(dishId);

      if (!result) {
        throw new BadRequestException('Dish not found');
      }

      return { message: 'Dish deleted successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to delete dish');
    }
  }

  @Post('chefs')
  async addChef(@Body() createChefDto: CreateChefDto) {
    try {
      const generatedId = await this.chefsService.insertChef(createChefDto);
      return { id: generatedId };
    } catch (error) {
      throw new BadRequestException('Failed to add chef');
    }
  }

  @Put('chefs/:chefId')
  async updateChef(
    @Param('chefId') chefId: string,
    @Body() updateChefDto: UpdateChefDto,
  ) {
    try {
      const updatedChef = await this.chefsService.updateChef(
        chefId,
        updateChefDto,
      );

      if (!updatedChef) {
        throw new BadRequestException('Chef not found');
      }

      return updatedChef;
    } catch (error) {
      throw new BadRequestException('Failed to update chef');
    }
  }

  @Delete('chefs/:chefId')
  async deleteChef(@Param('chefId') chefId: string) {
    try {
      const result = await this.chefsService.deleteChef(chefId);

      if (!result) {
        throw new BadRequestException('Chef not found');
      }

      return { message: 'Chef deleted successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to delete chef');
    }
  }

  @Post('users/register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const newUser = new CreateUserDto();
      newUser.email = createUserDto.email;
      newUser.password = createUserDto.password;

      const registeredUser = await this.userService.register(newUser);

      return { message: 'User registered successfully', user: registeredUser };
    } catch (error) {
      throw new HttpException(
        'Login failed. Check your email and password.',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Post('users/login')
  async userLogin(@Body() loginDto: LoginDto) {
    try {
      const user = await this.userService.login(loginDto);

      return { message: 'Login successful', user };
    } catch (error) {
      throw new HttpException(
        'Login failed. Check your email and password.',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}