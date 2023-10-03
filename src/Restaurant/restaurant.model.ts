import * as mongoose from 'mongoose';

export const RestaurantSchema = new mongoose.Schema({
  image: { type: String, required: true },
  name: { type: String, required: true },
  chefId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef' },
  rate: { type: Number, required: true },
  dishes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dish' }],
});


export interface Restaurant extends mongoose.Document {
  id: string;
  image: string;
  name: string;
  chefId: mongoose.Schema.Types.ObjectId;
  rate: number;
  dishes: string[];
}
