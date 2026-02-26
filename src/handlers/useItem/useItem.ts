import { Context } from 'hono';
import { findIndex, keys } from 'lodash';
import moment from 'moment';
import apiKeys from '../../mongo/schemas/apiKeys';
import items from '../../mongo/schemas/items';
import { AppEnv } from '../../types/express';

export const useItem = async (
  c: Context<AppEnv>
) => {
  const itemId = c.req.param('itemId');
  const currentUser = c.get('currentUser');

  if (!itemId) {
    return c.json({ message: 'Missing parameter playerName' }, 400);
  }

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
              return c.json({ message: 'You are already at max health' }, 200);
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
      return c.json({
        message: "You can't use " + itemToUse.name,
      }, 200);
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

    return c.json({ message: 'You used ' + itemToUse.name }, 200);
  } else {
    return c.json({
      message: 'You searched everywhere, but can not find this item.',
    }, 400);
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