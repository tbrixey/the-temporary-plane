import { Response } from 'express';
import { ExpressRequest } from '../../types';
import { find } from 'lodash';
import apiKeys from '../../mongo/schemas/apiKeys';

export const dropQuest = async (req: ExpressRequest, res: Response) => {
  const questId = parseInt(req.params.questId);
  const user = req.body.currentUser;
  const findQuest = find(user.quests, { id: questId });

  if (!questId) {
    return res.status(400).json({ message: 'Missing quest id.' });
  }

  if (!findQuest) {
    return res.status(400).json({ message: 'Quest not found.' });
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

  res.status(200).json('Quest abandoned!');
};
