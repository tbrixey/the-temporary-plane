import { connectDB } from '..';
import { classesSeed } from './classes';
import { itemsSeed } from './items';
import { locationSeed } from './locations';
import { questsSeed } from './quests';
import { racesSeed } from './races';
import { skillsSeed } from './skills';

const bigSeed = async () => {
  console.log('STARTING SEED');
  await connectDB();
  await locationSeed();
  await classesSeed();
  await racesSeed();
  await skillsSeed();
  await questsSeed();
  await itemsSeed();
  console.log('DONE SEEDING');
  process.exit(0);
};

bigSeed();
