import items from '../schemas/items';
// This registers a user to a specific class

export const itemsSeed = async () => {
  console.log('ITEMS SEED');
  await items.create({
    _id: '1',
    name: 'Minor Health Potion',
    description: 'Heals the player from minor injuries',
    effect: {
      hitpoints: 5,
    },
    type: 'consumable',
    value: 10,
    weight: 1,
  });
};
