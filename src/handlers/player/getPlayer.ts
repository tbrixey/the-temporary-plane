import { Request, Response } from 'express';
import apiKeys from '../../mongo/schemas/apiKeys';

export const getPlayer = async (req: Request, res: Response) => {
  const incommingPlayerName = req.params.playerName;

  if (!incommingPlayerName) {
    return res.status(400).json({ message: 'Missing parameter playerName' });
  }

  const authSplit = req.headers.authorization.split(' ');

  const collection = await apiKeys.findOne({
    playerName: incommingPlayerName,
  });

  if (collection) {
    if (collection.apiKey === authSplit[1]) {
      return res.status(200).json({ data: req.body.currentUser });
    } else if (collection) {
      return res.status(200).json({
        data: {
          playerName: collection.playerName,
          class: collection.class,
        },
      });
    }
  } else {
    return res.status(404).json({ message: 'Player not found' });
  }
};

export const getPlayers = async (req: Request, res: Response) => {
  const players = await apiKeys
    .find({ startingLocation: { $exists: true } })
    .populate('location')
    .select('playerName location');

  return res.status(200).json({ data: players });
};
