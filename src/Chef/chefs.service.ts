import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Chef } from './chef.model';
import { CreateChefDto, UpdateChefDto } from './chefs.dto';

@Injectable()
export class ChefsService {
  constructor(@InjectModel('Chef') private readonly chefModel: Model<Chef>) {}

  async insertChef(createChefDto: CreateChefDto) {
    const { image, name } = createChefDto;

    const newChef = new this.chefModel({
      image,
      name,
    });
    try {
      const result = await newChef.save();
      return result.id as string;
    } catch (error) {
      throw new Error('Failed to insert chef');
    }
  }

  async getChefs() {
    try {
      const chefs = await this.chefModel.find().exec();
      return chefs.map((chef) => this.mapChefToResponse(chef));
    } catch (error) {
      throw new Error('Failed to get chefs');
    }
  }

  async getSingleChef(chefId: string) {
    try {
      const chef = await this.findChef(chefId);
      return this.mapChefToResponse(chef);
    } catch (error) {
      throw new Error('Failed to get chef');
    }
  }

  async updateChef(chefId: string, updateChefDto: UpdateChefDto) {
    const { name } = updateChefDto;

    try {
      const updatedChef = await this.findChef(chefId);
      updatedChef.name = name;

      await updatedChef.save();
      return this.mapChefToResponse(updatedChef);
    } catch (error) {
      throw new Error('Failed to update chef');
    }
  }

  async deleteChef(chefId: string) {
    try {
      const result = await this.chefModel.findByIdAndDelete(chefId);
      if (!result) {
        throw new Error('Chef not found');
      }
      return { message: 'Chef deleted successfully' };
    } catch (error) {
      throw new Error('Failed to delete chef');
    }
  }

  async getChefNameById(chefId: string): Promise<string> {
    try {
      const chef = await this.findChef(chefId);
      return chef.name;
    } catch (error) {
      throw new Error('Chef not found');
    }
  }

  private async findChef(id: string): Promise<Chef> {
    const chef = await this.chefModel.findById(id);
    if (!chef) {
      throw new Error('Chef not found');
    }
    return chef;
  }

  private mapChefToResponse(chef: Chef) {
    return {
      id: chef.id,
      name: chef.name,
    };
  }
}
