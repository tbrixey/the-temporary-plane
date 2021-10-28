import express from "express";
import rateLimit from "express-rate-limit";
import cors from "cors";
import dotenv from "dotenv";
import { registerKey } from "./handlers/register";
import { client, dbName } from "./mongo";
const app = express();

dotenv.config();

const port = process.env.PORT || 8080;

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // limit
  message: "Rate limit exceeded. Please try again later.",
});

client.connect((err: any) => {
  const collection = client.db(dbName).collection("apiKeys");
  client.close();
});

app.use(express.json());
app.use(cors());
app.use("/api/", rateLimiter);

app.get("/", (req, res) => {
  res.send("The Temporary Plane is online");
});

app.post("/api/register", (req, res) => registerKey(req, res));

app.listen(port, () => {
  console.log(`Example app listening at port ${port}`);
});
