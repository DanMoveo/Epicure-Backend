import {
    Body,
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Query,
    BadRequestException,
  } from '@nestjs/common';
  import { CreateChefDto, UpdateChefDto } from '../dto/chefs.dto';
import { ChefsService } from 'src/services/chefs.service';
  
  @Controller('chefs')
  export class ChefsController {
    constructor(private readonly chefsService: ChefsService) {}
  
    @Post()
    async addChef(@Body() createChefDto: CreateChefDto) {
      try {
        const generatedId = await this.chefsService.insertChef(createChefDto);
        return { id: generatedId };
      } catch (error) {
        throw new BadRequestException('Failed to add chef');
      }
    }
  
    @Get()
    async getAllChefs() {
      try {
        const chefs = await this.chefsService.getChefs();
        return chefs;
      } catch (error) {
        throw new BadRequestException('Failed to get all chefs');
      }
    }
  
    @Get('chef')
    async getChef(@Query('id') chefId: string) {
      try {
        const chef = await this.chefsService.getSingleChef(chefId);
  
        if (!chef) {
          throw new BadRequestException('Chef not found');
        }
  
        return chef;
      } catch (error) {
        throw new BadRequestException('Failed to get chef');
      }
    }
    
    @Put('chef')
    async updateChef(
      @Query('id') chefId: string,
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
  
    @Delete('chef')
    async deleteChef(@Query('id') chefId: string) {
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
  }
  