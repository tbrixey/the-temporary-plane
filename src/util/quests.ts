import { find } from 'lodash';
import apiKeys from '../mongo/schemas/apiKeys';
import { User, Quest, Item } from '../types';
import { itemsToAdd } from './items';
import nextLevel from './nextLevel';

export const checkQuest = async (user: User, questId: string) => {
  const quest = find(user.quests, { _id: questId });
  if (!quest) {
    return { complete: false };
  }

  switch (quest.type) {
    case 'intro':
      if (user.class && user.race && user.startingLocation) {
        try {
          await giveRewards(user, quest.rewards, quest._id);
          return { complete: true, title: quest.title };
        } catch (err) {
          console.warn('Error giving rewards');
          return { complete: false };
        }
      } else {
        return { complete: false };
      }
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
    items?: { item: Item; count: number }[];
  },
  questId: string,
  acquire?: Item
) => {
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
    await itemsToAdd(user, rewards.items);
  }

  if (acquire) {
    query.$pull = { bag: { id: acquire }, quests: questId };
  } else {
    query.$pull = { quests: questId };
  }

  const updated = await apiKeys.findOneAndUpdate(
    { apiKey: user.apiKey },
    query
  );

  return updated;
};

const checkFetchQuest = async (user: User, quest: Quest) => {
  const checkItem = find(user.bag, { id: quest.acquire });
  const checkFinalLocation = user.location.name === quest.location;
  const checkGotoLocation = user.location.name === quest.goto;

  if (checkGotoLocation && !checkItem) {
    await itemsToAdd(user, [{ item: quest.acquire, count: 1 }]);
  }
  if (!checkItem) return { complete: false };
  if (!checkFinalLocation) return { complete: false };

  await giveRewards(user, quest.rewards, quest._id, quest.acquire);
  return { complete: true, title: quest.title };
};

const checkExploreQuest = async (user: User, quest: Quest) => {
  const checkFinalLocation = user.location.name === quest.location;

  if (!checkFinalLocation) return { complete: false };
  await giveRewards(user, quest.rewards, quest._id);
  return { complete: true, title: quest.title };
};
