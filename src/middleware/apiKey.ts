import { NextFunction, Request, Response } from 'express';
import apiKeys from '../mongo/schemas/apiKeys';
import { addBonusStats, mergeBag, mergeQuests } from '../util/player';

export const checkApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.headers.authorization) {
    const authSplit = req.headers.authorization.split(' ');
    const lookupKey = await apiKeys
      .findOne({ apiKey: authSplit[1] })
      .populate('bag.item')
      .populate('quests')
      .populate('locations');

    console.log('LOOKUP', lookupKey);

    if (lookupKey) {
      req.body.currentUser = lookupKey;
      next();
    } else {
      res.status(401).json({ message: 'unauthorized' });
    }
  } else {
    res.status(401).json({ message: 'unauthorized' });
  }
};
