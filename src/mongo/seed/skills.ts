import skills from '../schemas/skills';
// This registers a user to a specific class

export const skillsSeed = async () => {
  console.log('SKILLS SEED');
  await skills.create({
    skill: 'woodcutting',
    level: 0,
    itemId: 1,
    craftable: false,
    location: 'Atrium',
    itemName: 'Pine Wood',
    time: 60,
  });
};
