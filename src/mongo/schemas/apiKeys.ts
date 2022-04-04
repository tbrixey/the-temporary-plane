import mongoose from "mongoose";
import { itemSchema } from "./items";
import { questSchema } from "./quests";

const userSchema = new mongoose.Schema(
  {
    apiKey: {
      type: String,
      required: true,
    },
    playerName: {
      type: String,
      required: true,
    },
    count: Number,
    createdOn: {
      type: Date,
      immutable: true,
      default: () => Date.now(),
    },
    updatedOn: {
      type: Date,
      default: () => Date.now(),
    },
    level: Number,
    hitpoints: Number,
    maxHitpoints: Number,
    xpToNextLevel: Number,
    gold: Number,
    location: String,
    startingLocation: String,
    quests: [
      {
        type: mongoose.Types.ObjectId,
        ref: "quests",
      },
    ],
    bag: [
      {
        item: {
          type: mongoose.Types.ObjectId,
          ref: "items",
        },
        count: Number,
      },
    ],
    race: String,
    skills: {
      mining: Number,
      woodcutting: Number,
      arcana: Number,
      cooking: Number,
      gathering: Number,
    },
    class: String,
    speed: Number,
    stats: {
      str: Number,
      con: Number,
      dex: Number,
      int: Number,
      luck: Number,
    },
    weight: Number,
    arrivalTime: Date,
    finishTime: Date,
    levelPointsToUse: Number,
  },
  { collection: "apiKeys" }
);

userSchema.pre("save", function (this: any, next) {
  this.updatedOn = Date.now();
  next();
});

export default mongoose.model("apiKeys", userSchema);
