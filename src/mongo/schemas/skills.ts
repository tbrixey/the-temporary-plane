import mongoose from 'mongoose';
import { Skill } from '../../types';

const skillSchema = new mongoose.Schema<Skill>(
  {
    skill: String,
    level: Number,
    itemId: Number,
    itemName: Number,
    location: String,
    craftable: Boolean,
    time: Number,
  },
  { collection: 'skills' }
);

export default mongoose.model<Skill>('skills', skillSchema);
