import { Request, Response } from 'express';
import { client, dbName } from '../../mongo';

// This registers a user to a specific class

export const registerStartingCity = async (req: Request, res: Response) => {
  if (!req.params.cityName) {
    res.status(400).json({ message: 'Missing cityName' });
  }

  const authSplit = req.headers.authorization.split(' ');
  const collection = client.db(dbName).collection('apiKeys');

  const checkClass = await collection.findOne({ apiKey: authSplit[1] });

  if (checkClass.startingLocation) {
    return res
      .status(400)
      .json({ message: 'Player already has a starting location' });
  } else {
    const newDoc = await collection.findOneAndUpdate(
      { apiKey: authSplit[1] },
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
      data: { ...newDoc.value },
      message: `Starting city selected! The world is now yours!
      You can start by requesting your current quests via /api/quests/current
      You can see what quests are available in your current location via /api/quests/available
      You can travel to a new location. Get locations you can travel to via /api/locations
      You can get a list of things to do via /api/help.`,
    });
  }
};
