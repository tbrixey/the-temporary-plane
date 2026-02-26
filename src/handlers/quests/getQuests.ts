import { Quest } from './../../types/quest';
import { Context } from 'hono';
import quests from '../../mongo/schemas/quests';

interface GetQuestsInterface extends Quest {
  acquireItem?: any;
  rewardItems?: any;
}

export const getQuests = async (c: Context) => {
  const type = c.req.query('type');
  let matchType: { type: any } = { type: { $nin: ['intro'] } };

  if (type === 'fetch' || type === 'explore') {
    matchType = { type };
  }

  const questList = await quests
    .find({ active: true, ...matchType })
    .populate('acquire')
    .populate('rewards.items');

  return c.json(questList, 200);
};