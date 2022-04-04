import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    skill: String,
    level: Number,
    itemId: Number,
    itemName: Number,
    location: String,
    craftable: Boolean,
    time: Number,
  },
  { collection: "skills" }
);

export default mongoose.model("skills", skillSchema);
