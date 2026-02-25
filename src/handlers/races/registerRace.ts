import { Context } from 'hono';
import apiKeys from '../../mongo/schemas/apiKeys';
import { ExpressRequest } from '../../types';
// This registers a user to a specific class

export const registerRace = async (c: Context) => {
  const raceName = c.req.param('raceName');

  if (!raceName) {
    return c.json({ message: 'Missing race' }, 400);
  }

  const currentUser = c.get('currentUser');

  if (currentUser.race) {
    return c.json({ message: 'Player already has a race' }, 400);
  } else {
    const newDoc = await apiKeys.findOneAndUpdate(
      { apiKey: currentUser.apiKey },
      {
        $set: { race: raceName, updatedOn: new Date() },
      },
      { returnDocument: 'after' }
    );
    return c.json({
      data: { ...newDoc },
      message: 'Race selected! Pick a starting city /api/city/<racename>',
    }, 200);
  }
};