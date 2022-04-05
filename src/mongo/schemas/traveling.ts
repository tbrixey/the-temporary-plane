import mongoose from 'mongoose';
import { Traveling } from '../../types';

const travelSchema = new mongoose.Schema<Traveling>(
  {
    playerName: String,
    from: {
      type: mongoose.Types.ObjectId,
      ref: 'locations',
    },
    to: {
      type: mongoose.Types.ObjectId,
      ref: 'locations',
    },
    arrivalTime: Date,
  },
  { collection: 'traveling' }
);

export default mongoose.model<Traveling>('traveling', travelSchema);
