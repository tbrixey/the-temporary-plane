import { Request, Response } from 'express';
import apiKeys from '../../mongo/schemas/apiKeys';
import quests from '../../mongo/schemas/quests';

const genKey = () => {
  return [...Array(10)]
    .map((e) => (Math.random() * 36 || 0).toString(36))
    .join('')
    .replace(/\./g, '');
};

export const registerKey = async (req: Request, res: Response) => {
  if (req.params.playerName === undefined) {
    return res.status(400).send({ message: 'Missing player name' });
  }

  if (
    process.env.NODE_ENV !== 'test' &&
    req.params.playerName === 'unit-test-user-new'
  ) {
    return res.status(409).send({ message: 'Player already exists!' });
  }

  const playerName = req.params.playerName;

  if (playerName.length > 36) {
    return res.status(400).send({ message: 'Player name is too long!' });
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
    return res.status(201).json({
      data: {
        playerName,
        apiKey,
        message: 'Player created! Pick a class using /api/class/<classname>',
        quests: newPlayerQuest,
      },
    });
  } else {
    return res.status(409).json({ message: 'Player already exists!' });
  }
};
