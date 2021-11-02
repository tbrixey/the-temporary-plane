import { NextFunction, Request, Response } from "express";
import { client, dbName } from "../mongo";

export const checkApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.headers.authorization) {
    const authSplit = req.headers.authorization.split(" ");
    const collection = client.db(dbName).collection("apiKeys");
    const lookupKey = await collection.findOne({ apiKey: authSplit[1] });
    if (lookupKey) {
      next();
    } else {
      res.status(401).json({ message: "unauthorized" });
    }
  } else {
    res.status(401).json({ message: "unauthorized" });
  }
};
