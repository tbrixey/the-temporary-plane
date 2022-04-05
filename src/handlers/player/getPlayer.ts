import { Request, Response } from 'express';
import { client, dbName } from '../../mongo';
import { mergeBag } from '../../util/player';

export const getPlayer = async (req: Request, res: Response) => {
  const incommingPlayerName = req.params.playerName;

  if (!incommingPlayerName) {
    return res.status(400).json({ message: 'Missing parameter playerName' });
  }

  const authSplit = req.headers.authorization.split(' ');
  const keyCollection = client.db(dbName).collection('apiKeys');

  const collection = await keyCollection.findOne({
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
  const keyCollection = client.db(dbName).collection('apiKeys');

  const collection = await keyCollection
    .aggregate([
      { $match: { startingLocation: { $exists: true } } },
      {
        $lookup: {
          from: 'locations',
          localField: 'location',
          foreignField: 'name',
          as: 'locationCoords',
        },
      },
    ])
    .map((player) => ({
      playerName: player.playerName,
      location: player.location,
      x: player.locationCoords[0].x,
      y: player.locationCoords[0].y,
    }))
    .toArray();

  return res.status(200).json({ data: collection });
};
