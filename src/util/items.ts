import { find } from 'lodash';
import apiKeys from '../mongo/schemas/apiKeys';
import { Item, User } from '../types';

export const itemsToAdd = (
  user: User,
  givenItems: { item: Item; count: number }[]
) => {
  givenItems.forEach((item) => {
    const found = find(user.bag, { item: item.item._id });
    if (found) {
      apiKeys.updateOne(
        {
          apiKey: user.apiKey,
          'bag.item': item.item._id,
        },
        {
          $inc: {
            'bag.$.count': item.count,
          },
        }
      );
    } else {
      apiKeys.updateOne(
        {
          apiKey: user.apiKey,
        },
        {
          $push: {
            bag: item,
          },
        }
      );
    }
  });
};
