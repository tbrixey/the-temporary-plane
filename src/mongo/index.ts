import * as mongoDB from 'mongodb';
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
export const dbName = process.env.MONGODB_NAME;

export const client: mongoDB.MongoClient = new mongoDB.MongoClient(dbURI, {
  maxPoolSize: 10,
});

export const connectDB = async () => {
  // Connect the client to the server
  mongoose.connect(dbURI);
};

export const closeDB = async () => {
  await client.close();
};
