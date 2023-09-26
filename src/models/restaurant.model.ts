import * as mongoose from 'mongoose';



export const RestaurantSchema = new mongoose.Schema({
  image: { type: String, required: true },
  name: { type: String, required: true },
  chefName: { type: String, required: true },
  rate: { type: Number, required: true },
  dishes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dish' }],
});


export interface Restaurant extends mongoose.Document {
  id: string;
  image: string;
  name: string;
  chefName: string;
  rate: number;
  dishes: string[];
}

