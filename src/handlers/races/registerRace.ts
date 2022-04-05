import { Response } from 'express';
import apiKeys from '../../mongo/schemas/apiKeys';
import { ExpressRequest } from '../../types';
// This registers a user to a specific class

export const registerRace = async (req: ExpressRequest, res: Response) => {
  if (!req.params.raceName) {
    res.status(400).json({ message: 'Missing race' });
  }

  if (req.body.currentUser.race) {
    res.status(400).json({ message: 'Player already has a race' });
  } else {
    const newDoc = await apiKeys.findOneAndUpdate(
      { apiKey: req.body.currentUser.apiKey },
      {
        $set: { race: req.params.raceName, updatedOn: new Date() },
      },
      { returnDocument: 'after' }
    );
    res.status(200).json({
      data: { ...newDoc },
      message: 'Race selected! Pick a starting city /api/city/<racename>',
    });
  }
};
