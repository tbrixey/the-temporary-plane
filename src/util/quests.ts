import { find } from 'lodash';
import { client, dbName } from '../mongo';
import { User, Quest } from '../types';
import { itemsToAdd } from './items';
import nextLevel from './nextLevel';

export const checkQuest = async (user: User, questId: number) => {
  const quest = find(user.quests, { id: questId });
  if (!quest) {
    return { complete: false };
  }

  switch (quest.type) {
    case 'intro':
      if (quest.id === 1) {
        if (user.class && user.race && user.startingLocation) {
          try {
            await giveRewards(user, quest.rewards, quest.id);
            return { complete: true, title: quest.title };
          } catch (err) {
            console.warn('Error giving rewards');
            return { complete: false };
          }
        } else {
          return { complete: false };
        }
      }
      break;
    case 'fetch':
      return checkFetchQuest(user, quest);
    case 'explore':
      return checkExploreQuest(user, quest);
  }
};

const giveRewards = async (
  user: User,
  rewards: {
    gold: number;
    xp: number;
    items?: { id: number; count: number }[];
  },
  questId: number,
  acquire?: number
) => {
  const userCollection = client.db(dbName).collection('apiKeys');

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

  if (rewards.items && rewards.items.length > 0) {
    await itemsToAdd(user, rewards.items, userCollection);
  }

  if (acquire) {
    query.$pull = { bag: { id: acquire }, quests: { id: questId } };
  } else {
    query.$pull = { quests: { id: questId } };
  }

  return userCollection.updateOne(
    { apiKey: user.apiKey },
    query,
    (err, res) => {
      return res;
    }
  );
};

const checkFetchQuest = async (user: User, quest: Quest) => {
  const userCollection = client.db(dbName).collection('apiKeys');
  const checkItem = find(user.bag, { id: quest.acquire });
  const checkFinalLocation = user.location === quest.location;
  const checkGotoLocation = user.location === quest.goto;

  if (checkGotoLocation && !checkItem) {
    await itemsToAdd(user, [{ id: quest.acquire, count: 1 }], userCollection);
  }
  if (!checkItem) return { complete: false };
  if (!checkFinalLocation) return { complete: false };

  await giveRewards(user, quest.rewards, quest.id, quest.acquire);
  return { complete: true, title: quest.title };
};

const checkExploreQuest = async (user: User, quest: Quest) => {
  const checkFinalLocation = user.location === quest.location;

  if (!checkFinalLocation) return { complete: false };
  await giveRewards(user, quest.rewards, quest.id);
  return { complete: true, title: quest.title };
};
