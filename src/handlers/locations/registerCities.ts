import { Request, Response } from 'express';
import apiKeys from '../../mongo/schemas/apiKeys';

// This registers a user to a specific class

export const registerStartingCity = async (req: Request, res: Response) => {
  if (!req.params.cityName) {
    res.status(400).json({ message: 'Missing cityName' });
  }

  if (req.body.currentUser.startingLocation) {
    return res
      .status(400)
      .json({ message: 'Player already has a starting location' });
  } else {
    const newDoc = await apiKeys.findOneAndUpdate(
      { apiKey: req.body.currentUser.apiKey },
      {
        $set: {
          startingLocation: req.params.cityName,
          location: req.params.cityName,
          updatedOn: new Date(),
        },
      },
      { returnDocument: 'after' }
    );
    return res.status(200).json({
      data: { ...newDoc },
      message: `Starting city selected! The world is now yours!
      You can start by requesting your current quests via /api/quests/current
      You can see what quests are available in your current location via /api/quests/available
      You can travel to a new location. Get locations you can travel to via /api/locations
      You can get a list of things to do via /api/help.`,
    });
  }
};
