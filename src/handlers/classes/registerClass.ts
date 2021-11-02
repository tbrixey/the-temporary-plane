import { Request, Response } from "express";
import { client, dbName } from "../../mongo";

// This registers a user to a specific class

export const registerClass = async (req: Request, res: Response) => {
  if (!req.body.class) {
    res.status(400).json({ message: "Missing class" });
  }

  const authSplit = req.headers.authorization.split(" ");
  const collection = client.db(dbName).collection("apiKeys");

  const checkClass = await collection.findOne({ apiKey: authSplit[1] });

  if (checkClass.class) {
    res.status(400).json({ message: "Player already has a class" });
  } else {
    await collection.findOneAndUpdate(
      { apiKey: authSplit[1] },
      { $set: { class: req.body.class } }
    );
    res.status(200).json({ ...req.body });
  }
};
