import quests from '../schemas/quests';
// This registers a user to a specific class

export const questsSeed = async () => {
  console.log('QUESTS SEED');
  await quests.create({
    title: 'Intro to the Plane',
    description:
      'Finish creating your character for a quick boost to get you started!',
    type: 'intro',
    rewards: {
      gold: 100,
      xp: 100,
      items: [
        {
          item: 1,
          count: 1,
        },
      ],
    },
    active: true,
  });
};
