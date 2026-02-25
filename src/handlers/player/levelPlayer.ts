import { Context } from 'hono';
import apiKeys from '../../mongo/schemas/apiKeys';
import { ExpressRequest, User } from '../../types';

type Stats = 'str' | 'con' | 'int' | 'dex' | 'luck';

const updateStat = (user: User, stat: Stats) => {
  user.stats[stat] += 1;
  return user;
};

const updateSpeed = (user: User) => {
  user.speed += 2;
  return user;
};

const updateWeight = (user: User) => {
  user.weight += 3;
  return user;
};

const levelMap = new Map([
  ['str', (user: User) => updateStat(user, 'str')],
  ['dex', (user: User) => updateStat(user, 'dex')],
  ['int', (user: User) => updateStat(user, 'int')],
  ['con', (user: User) => updateStat(user, 'con')],
  ['luck', (user: User) => updateStat(user, 'luck')],
  ['speed', (user: User) => updateSpeed(user)],
  ['weight', (user: User) => updateWeight(user)],
]);

export const levelPlayer = async (
  c: Context<{}, { toLevel: string }>
) => {
  const user = c.get('currentUser');
  const toLevel = c.req.param('toLevel');
  if (!user.levelPointsToUse || user.levelPointsToUse <= 0) {
    return c.json({ message: "You don't have any level points to use." }, 400);
  }

  if (!levelMap.has(toLevel)) {
    return c.json({ message: 'Invalid stat to level: ' + toLevel }, 400);
  }

  levelMap.get(toLevel)(user);
  const newHP = 5 + user.stats.con;

  user.maxHitpoints += newHP;
  user.hitpoints += newHP;
  user.levelPointsToUse -= 1;

  await apiKeys.updateOne(
    { apiKey: user.apiKey },
    {
      $set: user,
    }
  );

  return c.json({ message: 'You leveled up!', user }, 200);
};