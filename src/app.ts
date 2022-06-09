import express from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { registerKey } from './handlers/player/register';
import { getClass, registerClass } from './handlers/classes';
import { checkApiKey } from './middleware/apiKey';
import {
  authorizePlayer,
  getPlayer,
  getPlayers,
  levelPlayer,
} from './handlers/player';
import {
  getCities,
  getLocations,
  registerStartingCity,
} from './handlers/locations';
import { getRaces, registerRace } from './handlers/races';
import { characterCreationComplete } from './middleware/characterCreationComplete';
import { travelTo } from './handlers/travel';
import { travelInfo } from './handlers/travel/travelInfo';
import { checkPlayerTravel } from './middleware/checkPlayerTravel';
import { useItem } from './handlers/useItem';
import { checkQuestComplete } from './middleware/checkQuestComplete';
import { acceptQuest, dropQuest, getQuests } from './handlers/quests';
import { isPlayerInCity } from './middleware/isPlayerInCity';
import { startSkilling, skillingInfo } from './handlers/skilling';
import { checkPlayerSkillingStatus } from './middleware/checkPlayerSkillingStatus';
const app = express();

dotenv.config();

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // limit
  message: 'Rate limit exceeded. Please try again later.',
});

app.use(bodyParser.json());
app.use(cors());
app.use('/gameapi', rateLimiter);

app.get('/gameapi', (req, res) => {
  res.send('The Temporary Plane is online');
});

app.post('/gameapi/register/:playerName', registerKey);
app.post('/gameapi/authorizePlayer', authorizePlayer);
app.get('/gameapi/players', getPlayers);
app.get('/gameapi/cities', getCities);
app.get('/gameapi/class', getClass);
app.get('/gameapi/race', getRaces);

app.use(checkApiKey);

app.post('/gameapi/class/:className', registerClass);
app.post('/gameapi/race/:raceName', registerRace);
app.post('/gameapi/city/:cityId', registerStartingCity);
app.get('/gameapi/player/:playerName', getPlayer);

app.use(characterCreationComplete);
app.use(checkPlayerTravel);
app.use(checkQuestComplete);
app.use(checkPlayerSkillingStatus);

app.use(async (req, res, next) => {
  const oldSend = res.json;
  res.json = (data) => {
    const questList =
      req.body.questsComplete && req.body.questsComplete.join(', ');
    const newData = {
      data,
      questsComplete: questList,
    };
    res.json = oldSend;
    return res.json(newData);
  };
  next();
});

app.post('/gameapi/player/level/:toLevel', levelPlayer);
app.post('/gameapi/item/use/:itemId', useItem);

app.get('/gameapi/travel/:destination', travelInfo);
app.post('/gameapi/travel/:destination', travelTo);

app.get('/gameapi/quests', isPlayerInCity, getQuests);
app.post('/gameapi/quests/:questId', isPlayerInCity, acceptQuest);
app.delete('/gameapi/quests/:questId', isPlayerInCity, dropQuest);

app.get('/gameapi/skilling', skillingInfo);
app.post('/gameapi/skilling', startSkilling);

app.use((req, res, next) => {
  res.status(404);
  res.send('The path was not found.');
});

export default app;
