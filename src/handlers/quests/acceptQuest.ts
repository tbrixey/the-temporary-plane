import { Context } from 'hono';
import { Quest } from '../../types/quest';
import apiKeys from '../../mongo/schemas/apiKeys';
import quests from '../../mongo/schemas/quests';

export const acceptQuest = async (c: Context) => {
  const questId = c.req.param('questId')?.trim() ?? '';
  const user = c.get('currentUser');
  const findQuest = user.quests.find((q: Quest) => String(q._id) === questId);

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