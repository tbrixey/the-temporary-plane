import { Context, Next } from 'hono';
import { AppEnv } from '../types/express';
import { Quest } from '../types/quest';
import { checkQuest } from '../util/quests';

export const checkQuestComplete = async (
  c: Context<AppEnv>,
  next: Next
) => {
  const currentUser = c.get('currentUser');

  if (currentUser?.quests?.length) {
    const questsComplete: string[] = [];
    await Promise.all(
      currentUser.quests.map(async (quest: Quest) => {
        const result = await checkQuest(currentUser, String(quest._id));
        if (result?.complete && quest.title) {
          questsComplete.push(quest.title);
        }
      })
    );
    c.set('questsComplete', questsComplete);
  }

  return next();
};