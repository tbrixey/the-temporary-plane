import { Request, Response } from "express";
import { client, dbName } from "../../mongo";

export const getPlayer = async (req: Request, res: Response) => {
  const incommingPlayerName = req.params.playerName;

  if (!incommingPlayerName) {
    return res.status(400).json({ message: "Missing parameter playerName" });
  }

  const authSplit = req.headers.authorization.split(" ");
  const keyCollection = client.db(dbName).collection("apiKeys");

  const collection = await keyCollection.findOne({
    playerName: incommingPlayerName,
  });

  if (collection) {
    if (collection.apiKey === authSplit[1]) {
      return res.status(200).json(collection);
    } else if (collection) {
      return res
        .status(200)
        .json({ playerName: collection.playerName, class: collection.class });
    }
  } else {
    return res.status(404).json({ message: "Player not found" });
  }
};

export const getPlayers = async (req: Request, res: Response) => {
  const keyCollection = client.db(dbName).collection("apiKeys");

  const collection = await keyCollection
    .find()
    .map((player) => ({
      playerName: player.playerName,
      location: player.location,
    }))
    .toArray();

  res.status(200).json(collection);
};
