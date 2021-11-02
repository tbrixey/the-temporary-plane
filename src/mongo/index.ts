import * as mongoDB from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const dbURI = process.env.MONGODB_URI;
export const dbName = process.env.MONGODB_NAME;

export const client: mongoDB.MongoClient = new mongoDB.MongoClient(dbURI, {
  maxPoolSize: 10,
});
