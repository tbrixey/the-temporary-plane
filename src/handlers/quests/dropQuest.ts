import { Context } from 'hono';
import { ExpressRequest } from '../../types';
import { find } from 'lodash';
import apiKeys from '../../mongo/schemas/apiKeys';

export const dropQuest = async (c: Context) => {
  const questId = parseInt(c.req.param('questId'));
  const user = c.get('currentUser');
  const findQuest = find(user.quests, { id: questId });

  if (!questId) {
    return c.json({ message: 'Missing quest id.' }, 400);
  }

  if (!findQuest) {
    return c.json({ message: 'Quest not found.' }, 400);
  }

  await apiKeys.updateOne(
    {
      apiKey: user.apiKey,
    },
    {
      $pull: {
        quests: questId,
      },
    }
  );

  return c.json('Quest abandoned!', 200);
};