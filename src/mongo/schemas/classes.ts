import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    weight: Number,
    speed: Number,
    bonus: String,
  },
  { collection: "classes" }
);

export default mongoose.model("classes", classSchema);
