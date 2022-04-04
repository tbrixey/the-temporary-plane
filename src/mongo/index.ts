import * as mongoDB from "mongodb";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbURI = process.env.MONGODB_URI;
export const dbName = process.env.MONGODB_NAME;

export const client: mongoDB.MongoClient = new mongoDB.MongoClient(dbURI, {
  maxPoolSize: 10,
});

export const connectDB = async () => {
  // Connect the client to the server
  mongoose.connect(dbURI);
  // Establish and verify connection
  await client.db("admin").command({ ping: 1 });
};

export const closeDB = async () => {
  await client.close();
};
