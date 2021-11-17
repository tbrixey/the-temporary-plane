import { Request, Response } from "express";
import { client, dbName } from "../../mongo";

export const getPlayer = async (req: Request, res: Response) => {
  const incommingPlayerName = req.params.playerName;

  if (!incommingPlayerName) {
    return res.status(400).json({ message: "Missing parameter playerName" });
  }

  const authSplit = req.headers.authorization.split(" ");
  const keyCollection = client.db(dbName).collection("apiKeys");

  const checkPlayer = await keyCollection.findOne({
    playerName: incommingPlayerName,
  });

  if (checkPlayer) {
    if (checkPlayer.apiKey === authSplit[1]) {
      return res.status(200).json(checkPlayer);
    } else if (checkPlayer) {
      return res
        .status(200)
        .json({ playerName: checkPlayer.playerName, class: checkPlayer.class });
    }
  } else {
    return res.status(404).json({ message: "Player not found" });
  }
};
