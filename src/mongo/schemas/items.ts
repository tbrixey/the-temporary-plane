import mongoose from "mongoose";

export const itemSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    effect: {
      stats: {
        str: Number,
        dex: Number,
        con: Number,
        int: Number,
        luck: Number,
      },
      hitpoints: Number,
      weight: Number,
      speed: Number,
      time: Number,
      items: [
        {
          id: mongoose.Types.ObjectId,
          count: Number,
        },
      ],
    },
    type: String,
    value: Number,
    weight: Number,
  },
  { collection: "items" }
);

export default mongoose.model("items", itemSchema);
