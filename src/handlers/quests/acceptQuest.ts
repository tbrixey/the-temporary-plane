import { Response } from 'express';
import { ExpressRequest } from '../../types';
import { find } from 'lodash';
import apiKeys from '../../mongo/schemas/apiKeys';
import quests from '../../mongo/schemas/quests';

export const acceptQuest = async (req: ExpressRequest, res: Response) => {
  const questId = parseInt(req.params.questId);
  const user = req.body.currentUser;
  const findQuest = find(user.quests, questId);

  if (!questId) {
    return res.status(400).json({ message: 'Missing quest id' });
  }

  if (findQuest) {
    return res.status(400).json({ message: 'Quest already accepted' });
  }

  const quest = quests.findOne({ _id: questId });

  if (!quest) {
    return res.status(400).json({ message: 'Quest does not exist' });
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

  res.status(200).json('Quest accepted!');
};
