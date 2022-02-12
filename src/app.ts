import express from "express";
import rateLimit from "express-rate-limit";
import cors from "cors";
import dotenv from "dotenv";
import { registerKey } from "./handlers/player/register";
import { getClass, registerClass } from "./handlers/classes";
import { checkApiKey } from "./middleware/apiKey";
import { getPlayer, getPlayers } from "./handlers/player";
import {
  getCities,
  getLocations,
  registerStartingCity,
} from "./handlers/locations";
import { getRaces, registerRace } from "./handlers/races";
import { characterCreationComplete } from "./middleware/characterCreationComplete";
import { travelTo } from "./handlers/travel";
import { travelInfo } from "./handlers/travel/travelInfo";
import { checkPlayerTravel } from "./middleware/checkPlayerTravel";
import { useItem } from "./handlers/useItem";
import { checkQuestComplete } from "./middleware/checkQuestComplete";
import { getQuests } from "./handlers/quests";
const app = express();

dotenv.config();

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // limit
  message: "Rate limit exceeded. Please try again later.",
});

app.use(express.json());
app.use(cors());
app.use("/api", rateLimiter);

app.get("/api", (req, res) => {
  res.send("The Temporary Plane is online");
});

app.post("/api/register/:playerName", registerKey);
app.get("/api/players", getPlayers);
// app.get("/api/locations", getLocations);
app.get("/api/cities", getCities);

app.use(checkApiKey);

app.post("/api/class/:className", registerClass);
app.post("/api/race/:raceName", registerRace);
app.post("/api/city/:cityName", registerStartingCity);
app.get("/api/player/:playerName", getPlayer);
app.get("/api/class", getClass);
app.get("/api/race", getRaces);

app.use(characterCreationComplete);
app.use(checkPlayerTravel);
app.use(checkQuestComplete);

app.use(async (req, res, next) => {
  const oldSend = res.json;
  res.json = (data) => {
    const questList =
      req.body.questsComplete && req.body.questsComplete.join(", ");
    const newData = {
      data,
      questsComplete: questList,
    };
    res.json = oldSend;
    return res.json(newData);
  };
  next();
});

app.post("/api/item/use/:itemId", useItem);
app.get("/api/travel/:destination", travelInfo);
app.post("/api/travel/:destination", travelTo);
app.get("/api/quests", getQuests);

app.use((req, res, next) => {
  res.status(404);
  res.send("The path was not found.");
});

export default app;
