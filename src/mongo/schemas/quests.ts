import mongoose from 'mongoose';
import { Quest } from '../../types';

export const questSchema = new mongoose.Schema<Quest>(
  {
    title: String,
    description: String,
    goto: String,
    type: {
      type: String,
      enum: ['intro', 'fetch', 'explore', 'kill'],
    },
    target: String,
    count: Number,
    tasks: [String],
    rewards: {
      gold: Number,
      xp: Number,
      items: [
        {
          item: {
            type: mongoose.Types.ObjectId,
            ref: 'items',
          },
          count: Number,
        },
      ],
    },
    active: Boolean,
    acquire: {
      type: mongoose.Types.ObjectId,
      ref: 'items',
    },
    location: String,
  },
  { collection: 'quests' }
);

export default mongoose.model<Quest>('quests', questSchema);
