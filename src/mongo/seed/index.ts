import { connectDB } from '..';
import { classesSeed } from './classes';
import { locationSeed } from './locations';
import { racesSeed } from './races';

const bigSeed = async () => {
  console.log('STARTING SEED');
  await connectDB();
  await locationSeed();
  await classesSeed();
  await racesSeed();
  console.log('DONE SEEDING');
  process.exit(0);
};

bigSeed();
