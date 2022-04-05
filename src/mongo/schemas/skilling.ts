import mongoose from 'mongoose';
import { Skilling } from '../../types';

const skillingSchema = new mongoose.Schema<Skilling>(
  {
    playerName: String,
    skill: String,
    arrivalTime: Date,
    count: Number,
  },
  { collection: 'skilling' }
);

export default mongoose.model<Skilling>('skilling', skillingSchema);
