import { Request, Response } from "express";
import { client, dbName } from "../../mongo";
import { mergeBag } from "../../util/player";

export const getPlayer = async (req: Request, res: Response) => {
  const incommingPlayerName = req.params.playerName;

  if (!incommingPlayerName) {
    return res.status(400).json({ message: "Missing parameter playerName" });
  }

  const authSplit = req.headers.authorization.split(" ");
  const keyCollection = client.db(dbName).collection("apiKeys");

  const collection = await keyCollection
    .aggregate([
      {
        $match: { playerName: incommingPlayerName },
      },
      {
        $lookup: {
          from: "items",
          localField: "bag.id",
          foreignField: "id",
          as: "items",
        },
      },
    ])
    .toArray();

  if (collection && collection[0]) {
    if (collection[0].apiKey === authSplit[1]) {
      const mergedCollection = mergeBag(collection[0]);

      return res.status(200).json(mergedCollection);
    } else if (collection) {
      return res.status(200).json({
        playerName: collection[0].playerName,
        class: collection[0].class,
      });
    }
  } else {
    return res.status(404).json({ message: "Player not found" });
  }
};

export const getPlayers = async (req: Request, res: Response) => {
  const keyCollection = client.db(dbName).collection("apiKeys");

  const collection = await keyCollection
    .find({ startingLocation: { $exists: true } })
    .map((player) => ({
      playerName: player.playerName,
      location: player.location,
    }))
    .toArray();

  return res.status(200).json(collection);
};
