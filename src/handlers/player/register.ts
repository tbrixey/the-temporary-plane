import { Request, Response } from "express";
import { client, dbName } from "../../mongo";

const genKey = () => {
  return [...Array(10)]
    .map((e) => (Math.random() * 36 || 0).toString(36))
    .join("")
    .replace(/\./g, "");
};

export const registerKey = async (req: Request, res: Response) => {
  if (req.params.playerName === undefined) {
    return res.status(400).send({ message: "Missing player name" });
  }
  const playerName = req.params.playerName;

  const apiKey = genKey();

  const collection = client.db(dbName).collection("apiKeys");

  const getPlayer = await collection.findOne({
    playerName,
  });

  if (!getPlayer) {
    await collection.insertOne({
      apiKey,
      count: 0,
      createdOn: new Date(),
      playerName,
      level: 1,
      maxHitpoints: 10,
      hitpoints: 10,
      xpToNextLevel: 100,
      bag: [{ id: 1, count: 2 }],
      skills: {
        mining: 0,
        woodcutting: 0,
        arcana: 0,
        cooking: 0,
        gathering: 0,
      },
    });
    return res.json({
      playerName,
      apiKey,
      message: "Player created! Pick a class using /api/class/<classname>",
    });
  } else {
    return res.status(409).json({ message: "Player already exists!" });
  }
};
