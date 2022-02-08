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

  if (
    process.env.NODE_ENV !== "test" &&
    req.params.playerName === "unit-test-user-new"
  ) {
    return res.status(409).send({ message: "Player already exists!" });
  }

  const playerName = req.params.playerName;

  const apiKey = genKey();

  const collection = client.db(dbName).collection("apiKeys");

  const getPlayer = await collection.findOne({
    playerName,
  });

  if (!getPlayer) {
    const newPlayerQuest = await client
      .db(dbName)
      .collection("quests")
      .find({ id: 1 }, { projection: { _id: 0 } })
      .toArray();

    await collection.insertOne({
      apiKey,
      count: 0,
      createdOn: new Date(),
      playerName,
      level: 1,
      maxHitpoints: 10,
      hitpoints: 10,
      xpToNextLevel: 100,
      gold: 0,
      bag: [],
      skills: {
        mining: 0,
        woodcutting: 0,
        arcana: 0,
        cooking: 0,
        gathering: 0,
      },
      quests: [{ id: 1 }],
    });
    return res.status(201).json({
      playerName,
      apiKey,
      message: "Player created! Pick a class using /api/class/<classname>",
      quests: newPlayerQuest[0],
    });
  } else {
    return res.status(409).json({ message: "Player already exists!" });
  }
};
