import { ObjectId } from 'mongodb';
import quests from '../schemas/quests';
// This registers a user to a specific class

export const questsSeed = async () => {
  console.log('QUESTS SEED');
  const itemId = new ObjectId('6579626d209aa0bd73c4e771');
  const questId = new ObjectId('61dc6460dd77ecf037e9251d');
  await quests.create({
    _id: questId,
    title: 'Intro to the Plane',
    description:
      'Finish creating your character for a quick boost to get you started!',
    type: 'intro',
    rewards: {
      gold: 100,
      xp: 100,
      items: [
        {
          item: itemId,
          count: 1,
        },
      ],
    },
    active: true,
  });
};
