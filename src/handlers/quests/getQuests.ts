import { Quest } from './../../types/quest';
import { Response } from 'express';
import { ExpressRequest } from '../../types';
import { find } from 'lodash';
import quests from '../../mongo/schemas/quests';

interface GetQuestsInterface extends Quest {
  acquireItem?: any;
  rewardItems?: any;
}

export const getQuests = async (req: ExpressRequest, res: Response) => {
  const type = req.query.type;
  let matchType: { type: any } = { type: { $nin: ['intro'] } };

  if (type === 'fetch' || type === 'explore') {
    matchType = { type };
  }

  const questList = await quests
    .find({ active: true, ...matchType })
    .populate('acquire')
    .populate('rewards.items');

  res.status(200).json(questList);
};
