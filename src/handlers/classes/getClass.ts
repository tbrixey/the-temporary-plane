import { Request, Response } from "express";
import { client, dbName } from "../../mongo";

// This provies class info when requested

export const getClass = async (req: Request, res: Response) => {
  const collection = client.db(dbName).collection("classes");

  const classes = await collection.find().toArray();

  res.status(200).json({ data: classes });
};
