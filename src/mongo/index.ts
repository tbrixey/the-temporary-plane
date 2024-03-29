import mongoose from 'mongoose';
import dotenv from 'dotenv';

// This ensures all models are loaded
require('./schemas/apiKeys');
require('./schemas/classes');
require('./schemas/items');
require('./schemas/locations');
require('./schemas/quests');
require('./schemas/races');
require('./schemas/skilling');
require('./schemas/skills');
require('./schemas/traveling');

dotenv.config();

const dbURI = process.env.MONGODB_URI;

export const connectDB = async () => {
  // Connect the client to the server
  mongoose.connect(dbURI);
};
