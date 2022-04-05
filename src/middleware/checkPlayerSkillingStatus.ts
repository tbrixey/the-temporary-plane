import { NextFunction, Request, Response } from 'express';
import { ExpressRequest } from '../types/express';
import moment from 'moment';
import skilling from '../mongo/schemas/skilling';
import apiKeys from '../mongo/schemas/apiKeys';

export const checkPlayerSkillingStatus = async (
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.body.currentUser) {
    const currentUser = req.body.currentUser;

    if (currentUser.finishTime) {
      const date = new Date();

      const skiller = await skilling.findOne({
        playerName: currentUser.playerName,
      });

      if (skiller) {
        if (currentUser.finishTime >= date) {
          const dateNow = moment(date);
          const dateFinished = moment(currentUser.finishTime);
          return res.status(200).json({
            message: `Currently skilling ${
              skiller.skill
            }. Please wait until you finish in ${dateFinished.diff(
              dateNow,
              'seconds'
            )} seconds`,
          });
        } else {
          await skilling.deleteOne({
            playerName: currentUser.playerName,
          });
          const incString = 'skills.' + skiller.skill;
          await apiKeys.findOneAndUpdate(
            { apiKey: currentUser.apiKey },
            {
              $inc: { [incString]: skiller.count },
              $unset: { finishTime: '' },
            }
          );
          return next();
        }
      } else {
        await apiKeys.findOneAndUpdate(
          { apiKey: currentUser.apiKey },
          { $unset: { finishTime: '' } }
        );
      }
    }

    return next();
  }
};
