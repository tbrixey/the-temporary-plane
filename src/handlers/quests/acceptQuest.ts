import { Context } from 'hono';
import { ExpressRequest } from '../../types';
import { find } from 'lodash';
import apiKeys from '../../mongo/schemas/apiKeys';
import quests from '../../mongo/schemas/quests';

export const acceptQuest = async (c: Context) => {
  const questId = parseInt(c.req.param('questId'));
  const user = c.get('currentUser');
  const findQuest = find(user.quests, questId);

  if (!questId) {
    return c.json({ message: 'Missing quest id' }, 400);
  }

  if (findQuest) {
    return c.json({ message: 'Quest already accepted' }, 400);
  }

  const quest = quests.findOne({ _id: questId });

  if (!quest) {
    return c.json({ message: 'Quest does not exist' }, 400);
  }

  await apiKeys.updateOne(
    {
      apiKey: user.apiKey,
    },
    {
      $push: {
        quests: questId,
      },
    }
  );

  return c.json('Quest accepted!', 200);
};