import { NextFunction, Response } from 'express';
import { ExpressRequest } from '../types/express';
import { checkQuest } from '../util/quests';

export const checkQuestComplete = async (
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.body.currentUser) {
    const currentUser = req.body.currentUser;
    if (currentUser.quests.length > 0) {
      currentUser.quests.forEach(async (quest) => {
        const questComplete = await checkQuest(currentUser, quest._id);
        if (questComplete.complete) {
          if (req.body.questsComplete === undefined) {
            req.body.questsComplete = [];
          }
          req.body.questsComplete.push(quest.title);
        }
      });
    }

    next();
  }
};
