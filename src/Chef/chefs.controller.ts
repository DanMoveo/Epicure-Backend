import {
  Controller,
  Get,
  BadRequestException,
  Param,
} from '@nestjs/common';
import { ChefsService } from 'src/Chef/chefs.service';

@Controller('chefs')
export class ChefsController {
  constructor(private readonly chefsService: ChefsService) { }
  
  @Get()
  async getAllChefs() {
    try {
      const chefs = await this.chefsService.getChefs();
      return chefs;
    } catch (error) {
      throw new BadRequestException('Failed to get all chefs');
    }
  }

  @Get('chef/:id')
  async getChef(@Param('id') chefId: string) {
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
  
}
