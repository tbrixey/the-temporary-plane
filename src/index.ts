import * as mongoDB from "mongodb";
import express from "express";
import dotenv from "dotenv";
const app = express();

dotenv.config();

const port = process.env.PORT || 8080;

const dbURI = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_NAME;

const client: mongoDB.MongoClient = new mongoDB.MongoClient(dbURI);

client.connect((err: any) => {
  const collection = client.db(dbName).collection("apiKeys");
  // perform actions on the collection object
  // tslint:disable-next-line:no-console
  console.log("collection: ", { collection });
  client.close();
});

app.get("/", (req, res) => {
  res.send("The Temporary Plane is online");
});

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`Example app listening at http://localhost:${port}`);
});
