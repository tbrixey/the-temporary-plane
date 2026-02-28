import { find } from 'lodash';
import apiKeys from '../mongo/schemas/apiKeys';
import { User, Quest, Item } from '../types';
import { itemsToAdd } from './items';
import nextLevel from './nextLevel';

export const checkQuest = async (user: User, questId: string) => {
  const questIdStr = String(questId);
  const quest = find(user.quests, (q) => String(q._id) === questIdStr);
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
    case 'kill':
      // Kill quest completion requires tracking monster kills (e.g. on User or a progress collection). Not yet implemented.
      return { complete: false };
    default:
      return { complete: false };
  }
};

const giveRewards = async (
  user: User,
  rewards: {
    gold?: number;
    xp?: number;
    items?: { item: Item; count: number }[];
  },
  questId: string,
  /** For fetch quests: Item (when populated) or quest acquire id string for bag $pull */
  acquire?: Item | string
) => {
  const gold = rewards.gold ?? 0;
  const xp = rewards.xp ?? 0;
  const query: any = {
    $inc: {
      gold,
    },
  };

  if (user.xpToNextLevel - xp <= 0) {
    user.xpToNextLevel = nextLevel(user.level + 1);
    query.$set = {
      xpToNextLevel: nextLevel(user.level + 1),
    };
    query.$inc = { ...query.$inc, level: 1, levelPointsToUse: 1 };
  } else {
    query.$inc = { ...query.$inc, xpToNextLevel: -xp };
  }

  if (rewards.items && rewards.items.length > 0) {
    await itemsToAdd(user, rewards.items);
  }

  const acquireId = acquire != null
    ? (typeof acquire === 'object' && '_id' in acquire ? String(acquire._id) : String(acquire))
    : undefined;
  if (acquireId) {
    query.$pull = { bag: { item: acquireId }, quests: questId };
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
  const acquireId = typeof quest.acquire === 'object' && quest.acquire?._id != null
    ? String(quest.acquire._id)
    : String(quest.acquire);
  const checkItem = find(user.bag, (b) => String(b.item._id) === acquireId);
  const checkFinalLocation = user.location.name === quest.location;
  const checkGotoLocation = quest.goto && user.location.name === quest.goto;

  if (checkGotoLocation && !checkItem && quest.acquire) {
    const acquireItem = typeof quest.acquire === 'object' ? quest.acquire : undefined;
    if (acquireItem) {
      await itemsToAdd(user, [{ item: acquireItem, count: 1 }]);
    }
  }
  if (!checkItem) return { complete: false };
  if (!checkFinalLocation) return { complete: false };

  await giveRewards(user, quest.rewards, quest._id, quest.acquire as Item | string | undefined);
  return { complete: true, title: quest.title };
};

const checkExploreQuest = async (user: User, quest: Quest) => {
  const checkFinalLocation = user.location.name === quest.location;

  if (!checkFinalLocation) return { complete: false };
  await giveRewards(user, quest.rewards, quest._id);
  return { complete: true, title: quest.title };
};
