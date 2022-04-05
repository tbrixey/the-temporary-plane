import mongoose from 'mongoose';
import { Traveling } from '../../types';

const travelSchema = new mongoose.Schema<Traveling>(
  {
    playerName: String,
    from: String,
    to: String,
    arrivalTime: Date,
  },
  { collection: 'traveling' }
);

export default mongoose.model<Traveling>('traveling', travelSchema);
