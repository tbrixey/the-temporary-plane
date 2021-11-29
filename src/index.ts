import express from "express";
import rateLimit from "express-rate-limit";
import cors from "cors";
import dotenv from "dotenv";
import { registerKey } from "./handlers/player/register";
import { client } from "./mongo";
import { getClass, registerClass } from "./handlers/classes";
import { checkApiKey } from "./middleware/apiKey";
import { getPlayer, getPlayers } from "./handlers/player";
import { getCities, registerStartingCity } from "./handlers/cities";
import { getRaces, registerRace } from "./handlers/races";
import { characterCreationComplete } from "./middleware/characterCreationComplete";
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

app.post("/api/register/:playerName", registerKey);
app.get("/api/players", getPlayers);

app.use(checkApiKey);

app.post("/api/class/:className", registerClass);
app.post("/api/race/:raceName", registerRace);
app.post("/api/city/:cityName", registerStartingCity);
app.get("/api/player/:playerName", getPlayer);
app.get("/api/class", getClass);
app.get("/api/race", getRaces);
app.get("/api/cities", getCities);

app.use(characterCreationComplete);

app.listen(port, () => {
  console.log(`Example app listening at port ${port}`);
});
