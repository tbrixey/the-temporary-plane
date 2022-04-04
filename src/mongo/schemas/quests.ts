import mongoose from "mongoose";

export const questSchema = new mongoose.Schema(
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

export default mongoose.model("quests", questSchema);
