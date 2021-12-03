import { Request, Response } from "express";
import { client, dbName } from "../../mongo";

// This provies class info when requested

export const travelTo = async (req: Request, res: Response) => {
  if (!req.params.destination) {
    return res.status(400).json({ message: "Missing destination" });
  }

  const collection = client.db(dbName).collection("locations");

  const classes = await collection.find({}).toArray();

  return res.status(200).json(classes);
};
