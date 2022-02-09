import { Quest } from "./../../types/quest";
import { Response } from "express";
import { client, dbName } from "../../mongo";
import { ExpressRequest } from "../../types";
import { find } from "lodash";

interface GetQuestsInterface extends Quest {
  acquireItem?: any;
  rewardItems?: any;
}

export const getQuests = async (req: ExpressRequest, res: Response) => {
  const type = req.query.type;
  let matchType: { type: any } = { type: { $nin: ["intro"] } };

  if (type === "fetch" || type === "explore") {
    matchType = { type };
  }

  const collection = client.db(dbName).collection("quests");
  const quests = await collection
    .aggregate([
      {
        $match: { active: true, ...matchType },
      },
      {
        $lookup: {
          from: "items",
          localField: "acquire",
          foreignField: "id",
          as: "acquireItem",
        },
      },
      {
        $lookup: {
          from: "items",
          localField: "rewards.items.id",
          foreignField: "id",
          as: "rewardItems",
        },
      },
      {
        $project: {
          _id: 0,
          active: 0,
          successMessage: 0,
        },
      },
    ])
    .toArray();

  const questMap = quests.map((quest: GetQuestsInterface) => {
    if (quest.acquire) {
      quest.acquire = quest.acquireItem[0].name;
    }
    delete quest.acquireItem;
    if (quest.rewards.items) {
      const items = quest.rewards.items.map((item) => {
        const itemMatch = find(quest.rewardItems, { id: item.id });
        if (itemMatch) {
          item.name = itemMatch.name;
        }
        return item;
      });
      quest.rewards.items = items;
    }
    delete quest.rewardItems;
    return quest;
  });

  res.status(200).json(questMap);
};
