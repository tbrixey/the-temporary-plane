import items from '../schemas/items';
import { ObjectId } from 'mongodb';
// This registers a user to a specific class

export const itemsSeed = async () => {
  console.log('ITEMS SEED');
  const id = new ObjectId('6579626d209aa0bd73c4e771');
  await items.create({
    _id: id,
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
