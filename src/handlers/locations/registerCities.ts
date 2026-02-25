import { Context } from 'hono';
import { ObjectId } from 'mongodb';
import apiKeys from '../../mongo/schemas/apiKeys';
import locations from '../../mongo/schemas/locations';

// This registers a user to a specific class

export const registerStartingCity = async (c: Context) => {
  const cityId = c.req.param('cityId');

  if (!cityId) {
    return c.json({ message: 'Missing cityId' }, 400);
  }

  const currentUser = c.get('currentUser');

  if (currentUser.startingLocation) {
    return c.json({ message: 'Player already has a starting location' }, 400);
  } else {
    const city = await locations.findOne({ _id: cityId });
    if (!city) {
      return c.json({ message: 'City does not exist' }, 400);
    }
    const startingLocationId = new ObjectId(cityId);
    const newDoc = await apiKeys.findOneAndUpdate(
      { apiKey: currentUser.apiKey },
      {
        $set: {
          startingLocation: startingLocationId,
          location: startingLocationId,
          updatedOn: new Date(),
        },
      },
      { returnDocument: 'after' }
    );
    return c.json({
      data: { ...newDoc },
      message: `Starting city selected! The world is now yours!
      You can start by requesting your current quests via /api/quests/current
      You can see what quests are available in your current location via /api/quests/available
      You can travel to a new location. Get locations you can travel to via /api/locations
      You can get a list of things to do via /api/help.`,
    }, 200);
  }
};