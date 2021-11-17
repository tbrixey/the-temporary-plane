import { Request, Response } from "express";
import { client, dbName } from "../../mongo";

// This registers a user to a specific class

export const registerClass = async (req: Request, res: Response) => {
  if (!req.params.className) {
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
      { $set: { class: req.params.className, updatedOn: new Date() } }
    );
    res.status(200).json({
      ...req.params,
      message: "Class selected! Pick a race using /race/<racename>",
    });
  }
};
