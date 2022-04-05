import mongoose from "mongoose";
import { Classes } from "../../types";

const classSchema = new mongoose.Schema<Classes>(
  {
    name: String,
    description: String,
    weight: Number,
    speed: Number,
    bonus: String,
  },
  { collection: "classes" }
);

export default mongoose.model<Classes>("classes", classSchema);
