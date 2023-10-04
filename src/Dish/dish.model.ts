import * as mongoose from 'mongoose';

export const DishSchema = new mongoose.Schema({
  image: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  icons: [{ type: String }],
});

export interface Dish extends mongoose.Document {
  id: string;
  image: string;
  name: string;
  description: string;
  price: number;
  category: string;
  icons: string[];
}