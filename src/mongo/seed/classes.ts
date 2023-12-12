import classes from '../schemas/classes';
// This registers a user to a specific class

export const classesSeed = async () => {
  console.log('CLASSES SEED');
  await classes.create({
    name: 'Warrior',
    description: '',
    weight: 200,
    speed: 50,
    bonus: '',
  });
};
