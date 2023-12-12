import { connectDB } from '..';
import { locationSeed } from './locations';

const bigSeed = async () => {
  console.log('STARTING SEED');
  await connectDB();
  await locationSeed();
  console.log('DONE SEEDING');
  process.exit(0);
};

bigSeed();
