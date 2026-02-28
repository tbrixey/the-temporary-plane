import { Context, Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { rateLimiter } from 'hono-rate-limiter';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { registerKey } from './handlers/player/register';
import { getClass, registerClass } from './handlers/classes';
import { checkApiKey, optionalApiKey } from './middleware/apiKey';
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
import { sellItem } from './handlers/sellItem';
import { recordKill } from './handlers/kill';
import { checkQuestComplete } from './middleware/checkQuestComplete';
import { acceptQuest, dropQuest, getQuests } from './handlers/quests';
import { isPlayerInCity } from './middleware/isPlayerInCity';
import { startSkilling, skillingInfo } from './handlers/skilling';
import { checkPlayerSkillingStatus } from './middleware/checkPlayerSkillingStatus';
import { AppEnv } from './types/express';

const authorizePlayerSchema = z.object({ apiKey: z.string() });
const startSkillingSchema = z.object({
  skillName: z.string(),
  item: z.string(),
  count: z.number().optional(),
});

const app = new Hono<AppEnv>();

// Rate limiting
app.use('/gameapi', rateLimiter({
  windowMs: 1 * 60 * 1000,
  limit: 100,
  keyGenerator: (c: Context) => c.req.header('x-forwarded-for') ?? c.req.raw.headers.get('host') ?? 'unknown',
}));

app.use(logger());
app.use(cors());

// Health check
app.get('/gameapi', (c) => {
  return c.json({ message: 'The Temporary Plane is online' });
});

// Public routes
app.post('/gameapi/register/:playerName', registerKey);
app.post('/gameapi/authorizePlayer', zValidator('json', authorizePlayerSchema), authorizePlayer);
app.get('/gameapi/players', getPlayers);
app.get('/gameapi/cities', optionalApiKey, getCities);
app.get('/gameapi/locations', optionalApiKey, getLocations);
app.get('/gameapi/class', getClass);
app.get('/gameapi/race', getRaces);

// API key authentication
app.use(checkApiKey);

app.post('/gameapi/class/:className', registerClass);
app.post('/gameapi/race/:raceName', registerRace);
app.post('/gameapi/city/:cityId', registerStartingCity);
app.get('/gameapi/player/:playerName', getPlayer);

// Character creation middleware
app.use(characterCreationComplete);
app.use(checkPlayerTravel);
app.use(checkQuestComplete);
app.use(checkPlayerSkillingStatus);

// Quest completion wrapper
app.use(async (c, next) => {
  const oldSend = c.res.headers.get('X-Quests-Complete');
  await next();
  if (oldSend) {
    c.res.headers.set('X-Quests-Complete', oldSend);
  }
});

app.post('/gameapi/player/level/:toLevel', levelPlayer);
app.post('/gameapi/item/use/:itemId', useItem);
app.post('/gameapi/item/sell/:itemId', sellItem);
app.post('/gameapi/kill/:monsterName', recordKill);

app.get('/gameapi/travel/:destination', travelInfo);
app.post('/gameapi/travel/:destination', travelTo);

app.get('/gameapi/quests', isPlayerInCity, getQuests);
app.post('/gameapi/quests/:questId', isPlayerInCity, acceptQuest);
app.delete('/gameapi/quests/:questId', isPlayerInCity, dropQuest);

app.get('/gameapi/skilling', skillingInfo);
app.post('/gameapi/skilling', zValidator('json', startSkillingSchema), startSkilling);

// 404 handler
app.notFound((c) => {
  return c.json({ message: 'The path was not found.' }, 404);
});

export default app;