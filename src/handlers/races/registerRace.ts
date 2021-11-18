import { Request, Response } from "express";
import { client, dbName } from "../../mongo";

// This registers a user to a specific class

export const registerRace = async (req: Request, res: Response) => {
  if (!req.params.raceName) {
    res.status(400).json({ message: "Missing race" });
  }

  const authSplit = req.headers.authorization.split(" ");
  const collection = client.db(dbName).collection("apiKeys");

  const checkRace = await collection.findOne({ apiKey: authSplit[1] });

  if (checkRace.race) {
    res.status(400).json({ message: "Player already has a race" });
  } else {
    const newDoc = await collection.findOneAndUpdate(
      { apiKey: authSplit[1] },
      {
        $set: { race: req.params.raceName, updatedOn: new Date() },
      },
      { returnDocument: "after" }
    );
    res.status(200).json({
      ...newDoc.value,
      message: "Race selected! Pick a starting city /api/city/<racename>",
    });
  }
};
