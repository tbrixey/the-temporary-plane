import { Response } from 'express';
import { findIndex, findKey, keys } from 'lodash';
import moment from 'moment';
import apiKeys from '../../mongo/schemas/apiKeys';
import items from '../../mongo/schemas/items';
import { ExpressRequest } from '../../types/express';

export const useItem = async (
  req: ExpressRequest<{}, { itemId: string }>,
  res: Response
) => {
  if (!req.params.itemId) {
    return res.status(400).json({ message: 'Missing parameter playerName' });
  }

  const itemId = req.params.itemId;
  const currentUser = req.body.currentUser;

  const itemIndex = findIndex(
    currentUser.bag,
    (o: any) => o.item._id.toString() === itemId
  );

  if (currentUser.bag[itemIndex] && currentUser.bag[itemIndex].count > 0) {
    const setField: any = {};
    const arrayFilters: any = {};
    const itemToUse = await items.findOne({ _id: itemId }).lean();

    if (itemToUse.type === 'consumable') {
      if (itemToUse.effect) {
        const effect = keys(itemToUse.effect);
        const now = new Date();
        console.log('UGH', effect, itemToUse);

        switch (effect[0]) {
          case 'hitpoints':
            if (currentUser.hitpoints < currentUser.maxHitpoints) {
              const newHitpoint =
                currentUser.hitpoints + itemToUse.effect.hitpoints >
                currentUser.maxHitpoints
                  ? currentUser.maxHitpoints
                  : currentUser.hitpoints + itemToUse.effect.hitpoints;

              setField.$set = {
                hitpoints: newHitpoint,
              };
            } else {
              return res
                .status(200)
                .json({ message: 'You are already at max health' });
            }
            break;
          case 'stats':
            setField.$set = {
              bonusStats: {
                stats: statItem(itemToUse.effect.stats),
                time: moment(now).add(itemToUse.effect.time, 'm').toDate(),
              },
            };
            break;
          case 'speed':
          case 'weight':
            setField.$set = {
              bonusStats:
                effect[0] === 'speed'
                  ? { speed: itemToUse.effect.speed }
                  : { weight: itemToUse.effect.weight },
            };
            setField.$set.bonusStats.time = moment(now)
              .add(itemToUse.effect.time, 'm')
              .toDate();
            break;
        }
      }
    } else if (itemToUse.type === 'junk') {
      return res.status(200).json({
        message: "You can't use " + itemToUse.name,
      });
    }

    // if (currentUser.bag[itemIndex].count - 1 <= 0) {
    //   setField.$pull = {
    //     bag: { _id: currentUser.bag[itemIndex]._id },
    //   };
    // } else {
    //   setField.$inc = {
    //     'bag.$[elem].count': -1,
    //   };
    //   arrayFilters.arrayFilters = [
    //     { 'elem._id': currentUser.bag[itemIndex]._id },
    //   ];
    // }

    if (setField && (setField.$set || setField.$inc)) {
      await apiKeys.updateOne(
        {
          apiKey: currentUser.apiKey,
        },
        setField,
        arrayFilters
      );
    }

    return res.status(200).json({ message: 'You used ' + itemToUse.name });
  } else {
    return res.status(400).json({
      message: 'You searched everywhere, but can not find this item.',
    });
  }
};

const statItem = (stat: { [key: string]: number }) => {
  const key = Object.keys(stat);

  switch (key[0]) {
    case 'str':
      return { str: stat.str };
    case 'con':
      return { con: stat.con };
    case 'dex':
      return { dex: stat.dex };
    case 'int':
      return { int: stat.int };
    case 'luck':
      return { luck: stat.luck };
  }
};
