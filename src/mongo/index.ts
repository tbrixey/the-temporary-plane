import * as mongoDB from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const dbURI = process.env.MONGODB_URI;
export const dbName = process.env.MONGODB_NAME;

export const client: mongoDB.MongoClient = new mongoDB.MongoClient(dbURI, {
  maxPoolSize: 10,
});

export const connectDB = async () => {
  // Connect the client to the server
  await client.connect();
  // Establish and verify connection
  await client.db("admin").command({ ping: 1 });
  console.log("Connected successfully to server");
};

export const closeDB = async () => {
  await client.close();
  console.log("Client closed");
};
