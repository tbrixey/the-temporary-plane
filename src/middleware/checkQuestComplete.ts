import { Context, Next } from 'hono';
import { checkQuest } from '../util/quests';

export const checkQuestComplete = async (
  c: Context,
  next: Next
) => {
  const currentUser = c.get('currentUser');

  if (currentUser) {
    if (currentUser.quests.length > 0) {
      const questsComplete: string[] = [];
      await Promise.all(currentUser.quests.map(async (quest) => {
        const questComplete = await checkQuest(currentUser, quest._id);
        if (questComplete.complete) {
          questsComplete.push(quest.title);
        }
      }));
      c.set('questsComplete', questsComplete);
    }
  }

  return next();
};