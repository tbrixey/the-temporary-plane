import { Context } from 'hono';
import apiKeys from '../../mongo/schemas/apiKeys';

export const getPlayer = async (c: Context) => {
  const incommingPlayerName = c.req.param('playerName');

  if (!incommingPlayerName) {
    return c.json({ message: 'Missing parameter playerName' }, 400);
  }

  const authSplit = c.req.header('authorization')?.split(' ');

  const collection = await apiKeys.findOne({
    playerName: incommingPlayerName,
  });

  if (collection) {
    if (collection.apiKey === authSplit?.[1]) {
      return c.json({ data: c.get('currentUser') }, 200);
    } else if (collection) {
      return c.json({
        data: {
          playerName: collection.playerName,
          class: collection.class,
        },
      }, 200);
    }
  } else {
    return c.json({ message: 'Player not found' }, 404);
  }
};

export const getPlayers = async (c: Context) => {
  const players = await apiKeys
    .find({ startingLocation: { $exists: true } })
    .populate('location')
    .select('playerName location');

  return c.json({ data: players }, 200);
};

export const authorizePlayer = async (c: Context) => {
  const body = await c.req.json<{ apiKey: string }>();
  console.info('AUTHORIZE ATTEMPT ', body);
  const players = await apiKeys
    .findOne({ apiKey: body.apiKey })
    .populate('bag.item')
    .populate('quests')
    .populate('location')
    .lean();

  return c.json({ data: players }, 200);
};