import express from "express";
import rateLimit from "express-rate-limit";
import cors from "cors";
import dotenv from "dotenv";
import { registerKey } from "./handlers/register";
import { client } from "./mongo";
import { getClass, registerClass } from "./handlers/classes";
import { checkApiKey } from "./middleware/apiKey";
const app = express();

dotenv.config();

const port = process.env.PORT || 8080;

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // limit
  message: "Rate limit exceeded. Please try again later.",
});

client.connect((err: any) => {
  // tslint:disable-next-line
  console.log("mongodb connected");
});

app.use(express.json());
app.use(cors());
app.use("/api/", rateLimiter);

app.get("/", (req, res) => {
  res.send("The Temporary Plane is online");
});

app.post("/api/register", (req, res) => registerKey(req, res));

app.use(checkApiKey);

app.post("/api/class", (req, res) => registerClass(req, res));
app.get("/api/class", (req, res) => getClass(req, res));

app.listen(port, () => {
  console.log(`Example app listening at port ${port}`);
});
