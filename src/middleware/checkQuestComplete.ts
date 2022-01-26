import { NextFunction, Response } from "express";
import { ExpressRequest } from "../types/express";
import { checkQuest } from "../util/quests";

export const checkQuestComplete = async (
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.body.currentUser) {
    const currentUser = req.body.currentUser;
    if (currentUser.quests.length > 0) {
      // Need to loop through all active quests and check them all.
      checkQuest(currentUser, currentUser.quests[0].id);
    }

    return next();
  }
};
