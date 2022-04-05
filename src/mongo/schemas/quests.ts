import mongoose from "mongoose";
import { Quest } from "../../types";

export const questSchema = new mongoose.Schema<Quest>(
  {
    title: String,
    description: String,
    goto: String,
    type: {
      type: String,
      enum: ["intro", "fetch", "explore"],
    },
    tasks: [String],
    rewards: {
      gold: Number,
      xp: Number,
      items: [
        {
          id: mongoose.Types.ObjectId,
          count: Number,
        },
      ],
    },
    active: Boolean,
    acquire: Number,
    location: String,
  },
  { collection: "quests" }
);

export default mongoose.model<Quest>("quests", questSchema);
