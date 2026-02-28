import mongoose from 'mongoose';
import { connectDB } from '..';
import { runSeed } from './runSeed';

import classes from '../schemas/classes';
import items from '../schemas/items';
import locations from '../schemas/locations';
import quests from '../schemas/quests';
import races from '../schemas/races';
import skills from '../schemas/skills';

/** Order: locations → classes → races → skills → items → quests (quests reference items). */
const SEED_MANIFEST: Array<{
  name: string;
  model: mongoose.Model<unknown>;
  file: string;
  upsertKeys: string[];
  prepare?: (doc: Record<string, unknown>) => Record<string, unknown>;
}> = [
  {
    name: 'locations',
    model: locations as mongoose.Model<unknown>,
    file: 'locations.json',
    upsertKeys: ['name', 'x', 'y'],
  },
  {
    name: 'classes',
    model: classes as mongoose.Model<unknown>,
    file: 'classes.json',
    upsertKeys: ['name'],
  },
  {
    name: 'races',
    model: races as mongoose.Model<unknown>,
    file: 'races.json',
    upsertKeys: ['name'],
  },
  {
    name: 'skills',
    model: skills as mongoose.Model<unknown>,
    file: 'skills.json',
    upsertKeys: ['skill'],
  },
  {
    name: 'items',
    model: items as mongoose.Model<unknown>,
    file: 'items.json',
    upsertKeys: ['_id'],
    prepare: (doc) => ({
      ...doc,
      _id: doc._id ? new mongoose.Types.ObjectId(doc._id as string) : undefined,
    }),
  },
  {
    name: 'quests',
    model: quests as mongoose.Model<unknown>,
    file: 'quests.json',
    upsertKeys: ['_id'],
    prepare: (doc) => {
      const out = { ...doc, _id: new mongoose.Types.ObjectId(doc._id as string) };
      const rewards = (doc.rewards as Record<string, unknown> | undefined) as
        | { items?: Array<{ item: string; count: number }> }
        | undefined;
      if (rewards?.items) {
        (out as Record<string, unknown>).rewards = {
          ...rewards,
          items: rewards.items.map((entry) => ({
            ...entry,
            item: new mongoose.Types.ObjectId(entry.item),
          })),
        };
      }
      return out;
    },
  },
];

const bigSeed = async () => {
  console.log('STARTING SEED');
  await connectDB();

  for (const { name, model, file, upsertKeys, prepare } of SEED_MANIFEST) {
    console.log(`${name.toUpperCase()} SEED`);
    await runSeed(model, file, upsertKeys as (keyof Record<string, unknown>)[], prepare);
  }

  console.log('DONE SEEDING');
  process.exit(0);
};

bigSeed();
