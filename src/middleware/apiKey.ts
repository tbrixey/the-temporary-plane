import { Context, Next } from 'hono';
import apiKeys from '../mongo/schemas/apiKeys';
import { addBonusStats } from '../util/player';

export const checkApiKey = async (
  c: Context,
  next: Next
) => {
  const authHeader = c.req.header('authorization');

  if (authHeader) {
    const authSplit = authHeader.split(' ');
    const lookupKey = await apiKeys
      .findOne({ apiKey: authSplit[1] })
      .populate('bag.item')
      .populate('quests')
      .populate('location')
      .lean();

    if (lookupKey) {
      const newUser = await addBonusStats(lookupKey);
      c.set('currentUser', newUser);
      return next();
    } else {
      return c.json({ message: 'unauthorized' }, 401);
    }
  } else {
    return c.json({ message: 'unauthorized' }, 401);
  }
};