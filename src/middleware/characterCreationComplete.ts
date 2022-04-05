import { NextFunction, Response } from 'express';
import { ExpressRequest } from '../types/express';

export const characterCreationComplete = async (
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.body.currentUser) {
    const currentUser = req.body.currentUser;
    if (!currentUser.class) {
      return res.json({
        message:
          'Please choose a class. Pick a class using /api/class/<classname>',
      });
    }
    if (!currentUser.race) {
      return res.json({
        message: 'Please choose a race. Pick a race using /api/race/<racename>',
      });
    }
    if (!currentUser.startingLocation) {
      return res.json({
        message:
          'Please choose a starting location. Pick a starting city /api/city/<racename>',
      });
    }

    return next();
  }
};
