import { NextFunction, Request, Response } from 'express';
import { ExpressRequest } from '../types/express';
import moment from 'moment';
import traveling from '../mongo/schemas/traveling';
import apiKeys from '../mongo/schemas/apiKeys';

export const checkPlayerTravel = async (
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.body.currentUser) {
    const currentUser = req.body.currentUser;

    if (currentUser.arrivalTime) {
      const date = new Date();

      const traveler = await traveling
        .findOne({
          playerName: currentUser.playerName,
        })
        .populate('to');

      if (traveler) {
        if (currentUser.arrivalTime >= date) {
          const dateNow = moment(date);
          const dateArrive = moment(currentUser.arrivalTime);
          return res.status(200).json({
            message: `Currently in transit to ${
              traveler.to.name
            }. Please wait until you arrive in ${dateArrive.diff(
              dateNow,
              'seconds'
            )} seconds`,
          });
        } else {
          await traveling.deleteOne({
            playerName: currentUser.playerName,
          });
          await apiKeys.findOneAndUpdate(
            { apiKey: currentUser.apiKey },
            {
              $set: { location: traveler.to._id },
              $unset: { arrivalTime: '' },
            }
          );
          req.body.currentUser.location = traveler.to;
          return next();
        }
      } else {
        await apiKeys.findOneAndUpdate(
          { apiKey: currentUser.apiKey },
          { $unset: { arrivalTime: '' } }
        );
      }
    }

    return next();
  }
};
