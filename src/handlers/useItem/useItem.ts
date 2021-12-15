import { Request, Response } from "express";
import { find } from "lodash";
import { client, dbName } from "../../mongo";

export const useItem = async (req: Request, res: Response) => {
  if (!req.params.itemId) {
    return res.status(400).json({ message: "Missing parameter playerName" });
  }

  const itemId = parseInt(req.params.itemId);
  const currentUser = req.body.currentUser;

  const findItem = find(currentUser.bag, { id: itemId });

  console.log("CURRENT", findItem);

  if (findItem && findItem.count > 0) {
    return res.status(200).json({ message: "Player used item" });
  } else {
    return res
      .status(400)
      .json({ message: "Player does not have item to use." });
  }
};
