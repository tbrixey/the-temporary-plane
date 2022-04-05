import { Request, Response } from "express";
import { client, dbName } from "../../mongo";
import apiKeys from "../../mongo/schemas/apiKeys";
import classes from "../../mongo/schemas/classes";

// This registers a user to a specific class

export const registerClass = async (req: Request, res: Response) => {
  if (!req.params.className) {
    return res.status(400).json({ message: "Missing class" });
  }

  const classFound = await classes.findOne({
    name: req.params.className,
  });

  if (!classFound) {
    return res.status(400).json({ message: "Class not found" });
  }

  const authSplit = req.headers.authorization.split(" ");

  const checkClass = await apiKeys.findOne({ apiKey: authSplit[1] });

  if (checkClass.class) {
    return res.status(400).json({ message: "Player already has a class" });
  } else {
    const statBoost: { [key: string]: number } = {
      str: 0,
      con: 0,
      dex: 0,
      int: 0,
      luck: 0,
    };

    switch (req.params.className) {
      case "Fighter":
        statBoost.str = 1;
        statBoost.con = 1;
        break;
      case "Rogue":
        statBoost.dex = 2;
        break;
      case "Mage":
        statBoost.int = 2;
        break;
      case "Cleric":
        statBoost.int = 1;
        statBoost.luck = 1;
        break;
      case "Ranger":
        statBoost.dex = 1;
        statBoost.con = 1;
        break;
    }

    const newDoc = await apiKeys.findOneAndUpdate(
      { apiKey: authSplit[1] },
      {
        $set: {
          class: req.params.className,
          weight: classFound.weight,
          speed: classFound.speed,
          updatedOn: new Date(),
          stats: statBoost,
        },
      },
      { returnDocument: "after" }
    );
    return res.status(200).json({
      data: { ...newDoc },
      message: "Class selected! Pick a race using /api/race/<racename>",
    });
  }
};
