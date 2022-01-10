import { NextFunction, Request, Response } from "express";
import { client, dbName } from "../mongo";
import { addBonusStats, mergeBag, mergeQuests } from "../util/player";

export const checkApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.headers.authorization) {
    const authSplit = req.headers.authorization.split(" ");
    const collection = client.db(dbName).collection("apiKeys");
    const lookupKey = await collection
      .aggregate([
        {
          $match: { apiKey: authSplit[1] },
        },
        {
          $lookup: {
            from: "items",
            localField: "bag.id",
            foreignField: "id",
            as: "items",
          },
        },
        {
          $lookup: {
            from: "quests",
            localField: "quests.id",
            foreignField: "id",
            as: "fullQuests",
          },
        },
      ])
      .toArray();

    if (lookupKey) {
      const mergedBagCollection = await mergeBag(lookupKey[0]);
      const mergedQuestCollection = await mergeQuests(mergedBagCollection);
      const adjustedUser = await addBonusStats(
        mergedQuestCollection,
        collection
      );
      req.body.currentUser = adjustedUser;
      next();
    } else {
      res.status(401).json({ message: "unauthorized" });
    }
  } else {
    res.status(401).json({ message: "unauthorized" });
  }
};
