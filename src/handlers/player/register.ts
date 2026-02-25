import { Context } from 'hono';
import apiKeys from '../../mongo/schemas/apiKeys';
import quests from '../../mongo/schemas/quests';

const genKey = () => {
  return [...Array(10)]
    .map((e) => (Math.random() * 36 || 0).toString(36))
    .join('')
    .replace(/\./g, '');
};

export const registerKey = async (c: Context) => {
  const playerName = c.req.param('playerName');

  if (playerName === undefined) {
    return c.json({ message: 'Missing player name' }, 400);
  }

  if (
    process.env.NODE_ENV !== 'test' &&
    playerName === 'unit-test-user-new'
  ) {
    return c.json({ message: 'Player already exists!' }, 409);
  }

  if (playerName.length > 36) {
    return c.json({ message: 'Player name is too long!' }, 400);
  }

  const apiKey = genKey();

  const getPlayer = await apiKeys.findOne({
    playerName,
  });

  if (!getPlayer) {
    const newPlayerQuest = await quests.findOne({
      _id: '61dc6460dd77ecf037e9251d',
    });

    await apiKeys.create({
      apiKey,
      count: 0,
      playerName,
      level: 1,
      maxHitpoints: 10,
      hitpoints: 10,
      xpToNextLevel: 100,
      gold: 0,
      bag: [],
      skills: {
        mining: 0,
        woodcutting: 0,
        arcana: 0,
        cooking: 0,
        gathering: 0,
      },
      quests: ['61dc6460dd77ecf037e9251d'],
    });
    return c.json({
      data: {
        playerName,
        apiKey,
        message: 'Player created! Pick a class using /api/class/<classname>',
        quests: newPlayerQuest,
      },
    }, 201);
  } else {
    return c.json({ message: 'Player already exists!' }, 409);
  }
};