import { Request, Response } from "express";
import { client, dbName } from "../../mongo";

// This registers a user to a specific class

export const registerClass = async (req: Request, res: Response) => {
  if (!req.params.className) {
    return res.status(400).json({ message: "Missing class" });
  }

  const classCollection = client.db(dbName).collection("classes");
  const classes = await classCollection
    .find()
    .map((doc) => doc.name)
    .toArray();

  if (!classes.includes(req.params.className)) {
    return res.status(400).json({ message: "Class not found" });
  }

  const authSplit = req.headers.authorization.split(" ");
  const collection = client.db(dbName).collection("apiKeys");

  const checkClass = await collection.findOne({ apiKey: authSplit[1] });

  if (checkClass.class) {
    return res.status(400).json({ message: "Player already has a class" });
  } else {
    const statBoost: { [key: string]: number } = {};

    switch (req.params.className) {
      case "Fighter":
        statBoost["stats.str"] = 1;
        statBoost["stats.con"] = 1;
        break;
      case "Rogue":
        statBoost["stats.dex"] = 1;
        break;
      case "Mage":
        statBoost["stats.int"] = 1;
        break;
      case "Cleric":
        statBoost["stats.int"] = 1;
        statBoost["stats.luck"] = 1;
        break;
      case "Ranger":
        statBoost["stats.dex"] = 1;
        statBoost["stats.con"] = 1;
        break;
    }

    const newDoc = await collection.findOneAndUpdate(
      { apiKey: authSplit[1] },
      {
        $set: {
          class: req.params.className,
          updatedOn: new Date(),
          "stats.str": 1,
        },
      },
      { returnDocument: "after" }
    );
    return res.status(200).json({
      ...newDoc.value,
      message: "Class selected! Pick a race using /api/race/<racename>",
    });
  }
};
