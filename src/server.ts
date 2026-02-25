import { connectDB } from './mongo';
import { serve } from '@hono/node-server';
import app from './app';

const port = process.env.PORT || 80;

const run = async () => {
  await connectDB();

  serve({ fetch: app.fetch, port });
  console.log(`Server is running on port ${port}`);
};

run();