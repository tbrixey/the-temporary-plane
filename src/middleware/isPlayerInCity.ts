import { NextFunction, Response } from 'express';
import locations from '../mongo/schemas/locations';
import { ExpressRequest } from '../types';

export const isPlayerInCity = async (
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.body.currentUser.location.type === 'city') {
    next();
  } else {
    return res
      .status(400)
      .json({ message: 'Must be located in a city to run this command.' });
  }
};
