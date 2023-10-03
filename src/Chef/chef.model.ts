import * as mongoose from 'mongoose';

export const ChefSchema = new mongoose.Schema({
  image: { type: String, required: true },
  name: { type: String, required: true },
});

export interface Chef extends mongoose.Document {
  id: string;
  image: string;
  name: string;
}
