import { NextFunction, Request, Response } from 'express';
import apiKeys from '../mongo/schemas/apiKeys';
import { addBonusStats } from '../util/player';

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
      .populate('location')
      .lean();

    if (lookupKey) {
      const newUser = await addBonusStats(lookupKey);
      req.body.currentUser = newUser;
      next();
    } else {
      res.status(401).json({ message: 'unauthorized' });
    }
  } else {
    res.status(401).json({ message: 'unauthorized' });
  }
};
