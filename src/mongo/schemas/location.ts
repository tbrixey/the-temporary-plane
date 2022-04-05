import mongoose from "mongoose";
import { Location } from "../../types";

const locationSchema = new mongoose.Schema<Location>(
  {
    name: String,
    type: {
      type: String,
      enum: ["city", "poi", "town"],
    },
    x: Number,
    y: Number,
    population: Number,
  },
  { collection: "locations" }
);

export default mongoose.model<Location>("locations", locationSchema);
