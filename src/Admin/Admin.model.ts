import * as mongoose from 'mongoose';

export const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
});

export interface Admin extends mongoose.Document {
  id: string;
  name: string;
  password: string;
}
