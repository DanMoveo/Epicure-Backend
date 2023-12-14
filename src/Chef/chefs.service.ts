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
    const result = await newChef.save();
    return result.id as string;
  }

  async getChefs() {
    const chefs = await this.chefModel.find().exec();
    return chefs.map((chef) => this.mapChefToResponse(chef));
  }

  async getSingleChef(chefId: string) {
    const chef = await this.findChef(chefId);
    return this.mapChefToResponse(chef);
  }

  async updateChef(chefId: string, updateChefDto: UpdateChefDto) {
    const { name, image } = updateChefDto;
    const updatedChef = await this.findChef(chefId);
    updatedChef.name = name;
    updatedChef.image = image;
    await updatedChef.save();
    return this.mapChefToResponse(updatedChef);
  }

  async deleteChef(chefId: string) {
    const result = await this.chefModel.findByIdAndDelete(chefId);
    if (!result) {
      throw new Error('Chef not found');
    }
    return { message: 'Chef deleted successfully' };
  }

  async getChefNameById(chefId: string): Promise<string> {
    const chef = await this.findChef(chefId);
    return chef.name;
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
      image: chef.image,
    };
  }
}
