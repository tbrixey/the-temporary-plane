import { NextFunction, Request, Response } from "express";
import { client, dbName } from "../mongo";

export const characterCreationComplete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.headers.authorization) {
    const authSplit = req.headers.authorization.split(" ");
    const collection = client.db(dbName).collection("apiKeys");
    const lookupKey = await collection.findOne({ apiKey: authSplit[1] });

    if (!lookupKey.class) {
      return res.json({
        message:
          "Please choose a class. Pick a class using /api/class/<classname>",
      });
    }
    if (!lookupKey.race) {
      return res.json({
        message: "Please choose a race. Pick a race using /api/race/<racename>",
      });
    }
    if (!lookupKey.startingLocation) {
      return res.json({
        message:
          "Please choose a starting location. Pick a starting city /api/city/<racename>",
      });
    }

    return next;
  }
};
