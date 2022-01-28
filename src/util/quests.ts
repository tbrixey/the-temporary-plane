import { find } from "lodash";
import { Collection, Document } from "mongodb";
import { client, dbName } from "../mongo";
import { User } from "../types";

export const checkQuest = async (user: User, questId: number) => {
  const quest = find(user.quests, { id: questId });
  if (!quest) {
    return { complete: false };
  }

  switch (quest.type) {
    case "intro":
      if (quest.id === 1) {
        if (user.class && user.race && user.startingLocation) {
          try {
            await giveRewards(user, quest.rewards, quest.id);
            return { complete: true, title: quest.title };
          } catch (err) {
            console.warn("Error giving rewards");
            return { complete: false };
          }
        } else {
          return { complete: false };
        }
      }
      break;
    case "fetch":
      break;
    case "explore":
      break;
  }
};

const giveRewards = async (
  user: User,
  rewards: {
    gold: number;
    xp: number;
    items: { id: number; count: number }[];
  },
  questId: number
) => {
  const userCollection = client.db(dbName).collection("apiKeys");

  const query: any = {
    $inc: {
      gold: rewards.gold,
    },
  };

  if (user.xpToNextLevel - rewards.xp <= 0) {
    user.xpToNextLevel = nextLevel(user.level + 1);
    query.$set = {
      xpToNextLevel: nextLevel(user.level + 1),
    };
    query.$inc = { ...query.$inc, level: 1, levelPointToUse: 1 };
  } else {
    query.$inc = { ...query.$inc, xpToNextLevel: -rewards.xp };
  }

  if (rewards.items.length > 0) {
    itemsToAdd(user, rewards.items, userCollection);
  }

  query.$pull = { quests: { id: questId } };

  return userCollection.updateOne(
    { apiKey: user.apiKey },
    query,
    (err, res) => {
      return res;
    }
  );
};

const nextLevel = (level: number) => {
  const exponent = 1.5;
  const baseXP = 100;
  return Math.floor(baseXP * level ** exponent);
};

const itemsToAdd = (
  user: User,
  givenItems: { id: number; count: number }[],
  collection: Collection<Document>
) => {
  givenItems.forEach((item) => {
    const found = find(user.bag, { id: item.id });
    if (found) {
      collection.updateOne(
        {
          apiKey: user.apiKey,
          "bag.id": item.id,
        },
        {
          $inc: {
            "bag.$.count": 1,
          },
        }
      );
    } else {
      collection.updateOne(
        {
          apiKey: user.apiKey,
        },
        {
          $push: {
            bag: item,
          },
        }
      );
    }
  });
};
