import { Response } from "express";
import { client, dbName } from "../../mongo";
import { ExpressRequest } from "../../types";
import { find } from "lodash";

export const acceptQuest = async (req: ExpressRequest, res: Response) => {
  const questId = parseInt(req.params.questId);
  const user = req.body.currentUser;
  const findQuest = find(user.quests, { id: questId });

  if (!questId || Number.isNaN(questId)) {
    return res.status(400).json({ message: "Missing quest id" });
  }

  if (findQuest) {
    return res.status(400).json({ message: "Quest already accepted" });
  }

  const collection = client.db(dbName).collection("apiKeys");
  await collection.updateOne(
    {
      apiKey: user.apiKey,
    },
    {
      $push: {
        quests: { id: questId },
      },
    }
  );

  res.status(200).json("Quest accepted!");
};
