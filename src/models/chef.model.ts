import * as mongoose from 'mongoose';

export const ChefSchema = new mongoose.Schema({
  image: { type: String, required: true },
  name: { type: String, required: true },
  restaurantIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }],
});

export interface Chef extends mongoose.Document {
  id: string;
  image: string;
  name: string;
  restaurantIds: mongoose.Schema.Types.ObjectId[];
}
