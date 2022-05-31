import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import apiKeys from '../../mongo/schemas/apiKeys';
import locations from '../../mongo/schemas/locations';

// This registers a user to a specific class

export const registerStartingCity = async (req: Request, res: Response) => {
  if (!req.params.cityId) {
    res.status(400).json({ message: 'Missing cityId' });
  }

  if (req.body.currentUser.startingLocation) {
    return res
      .status(400)
      .json({ message: 'Player already has a starting location' });
  } else {
    const city = await locations.findOne({ _id: req.params.cityId });
    if (!city) {
      return res.status(400).json({ message: 'City does not exist' });
    }
    const newDoc = await apiKeys.findOneAndUpdate(
      { apiKey: req.body.currentUser.apiKey },
      {
        $set: {
          startingLocation: ObjectId(req.params.cityId),
          location: ObjectId(req.params.cityId),
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
