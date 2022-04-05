import mongoose from "mongoose";
import { Race } from "../../types";

const racesSchema = new mongoose.Schema<Race>(
  {
    name: String,
    description: String,
  },
  { collection: "races" }
);

export default mongoose.model<Race>("races", racesSchema);
