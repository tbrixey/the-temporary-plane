import { get, keys } from 'lodash';
import apiKeys from '../mongo/schemas/apiKeys';
import { User } from '../types';

export const addBonusStats = async (playerCollection: User) => {
  if (!playerCollection.bonusStats) {
    return playerCollection;
  }

  const date = new Date();

  if (playerCollection.bonusStats.time < date) {
    delete playerCollection.bonusStats;

    await apiKeys.findOneAndUpdate(
      { apiKey: playerCollection.apiKey },
      { $unset: { bonusStats: '' } }
    );

    return playerCollection;
  }

  const bonusKeys = keys(playerCollection.bonusStats);

  switch (bonusKeys[0]) {
    case 'stats':
      const stat = keys(playerCollection.bonusStats.stats);

      playerCollection.stats[stat[0]] +=
        playerCollection.bonusStats.stats[stat[0]];
      break;
    case 'speed':
      playerCollection.speed += playerCollection.bonusStats.speed;
      break;
    case 'weight':
      playerCollection.weight += playerCollection.bonusStats.weight;
      break;
  }

  return playerCollection;
};
