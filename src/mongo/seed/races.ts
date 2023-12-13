import races from '../schemas/races';
// This registers a user to a specific class

export const racesSeed = async () => {
  console.log('RACES SEED');
  await races.create({
    name: 'Human',
    description: 'Just a normal human',
  });
};
