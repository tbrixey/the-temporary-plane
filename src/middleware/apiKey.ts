import { NextFunction, Request, Response } from "express";
import { client, dbName } from "../mongo";
import { mergeBag } from "../util/player";

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
      ])
      .toArray();

    if (lookupKey) {
      const mergedCollection = mergeBag(lookupKey[0]);
      req.body.currentUser = mergedCollection;
      next();
    } else {
      res.status(401).json({ message: "unauthorized" });
    }
  } else {
    res.status(401).json({ message: "unauthorized" });
  }
};
