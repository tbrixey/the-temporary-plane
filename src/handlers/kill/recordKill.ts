import { Context } from 'hono';
import apiKeys from '../../mongo/schemas/apiKeys';
import { AppEnv } from '../../types/express';

/**
 * Known monsters from the seed. Used to validate kill requests without requiring
 * a full monsters collection in the DB.
 */
const MONSTERS: { name: string; location: string }[] = [
  { name: 'Aggressive Pigeon', location: 'Solstice Plaza' },
  { name: 'Sentient Dust Bunny', location: 'Shady Alley' },
  { name: 'Buff Rat', location: 'Solstice Sewers' },
];

export const recordKill = async (c: Context<AppEnv>) => {
  const currentUser = c.get('currentUser');
  const monsterName = decodeURIComponent(c.req.param('monsterName'));

  const monster = MONSTERS.find(
    (m) => m.name.toLowerCase() === monsterName.toLowerCase()
  );

  if (!monster) {
    return c.json({ message: `Unknown monster: ${monsterName}` }, 404);
  }

  if (currentUser.location.name !== monster.location) {
    return c.json(
      {
        message: `${monster.name} is not here. Try heading to ${monster.location}.`,
      },
      400
    );
  }

  const incKey = `killCounts.${monster.name}`;

  await apiKeys.updateOne(
    { apiKey: currentUser.apiKey },
    { $inc: { [incKey]: 1 } }
  );

  const existingCount =
    (currentUser.killCounts instanceof Map
      ? currentUser.killCounts.get(monster.name)
      : (currentUser.killCounts as Record<string, number>)?.[monster.name]) ?? 0;

  return c.json(
    {
      message: `You defeated a ${monster.name}!`,
      kills: existingCount + 1,
    },
    200
  );
};
