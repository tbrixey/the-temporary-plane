import { Context } from 'hono';
import { Quest } from '../../types/quest';
import apiKeys from '../../mongo/schemas/apiKeys';

export const dropQuest = async (c: Context) => {
  const questId = c.req.param('questId')?.trim() ?? '';
  const user = c.get('currentUser');
  const findQuest = user.quests.find((q: Quest) => String(q._id) === questId);

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