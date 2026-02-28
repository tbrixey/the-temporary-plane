import { Context } from 'hono';
import { findIndex } from 'lodash';
import apiKeys from '../../mongo/schemas/apiKeys';
import items from '../../mongo/schemas/items';
import { AppEnv } from '../../types/express';

export const sellItem = async (c: Context<AppEnv>) => {
  const itemId = c.req.param('itemId');
  const currentUser = c.get('currentUser');

  if (!itemId) {
    return c.json({ message: 'Missing parameter itemId' }, 400);
  }

  const body = await c.req.json().catch(() => ({}));
  const countToSell: number = body?.count && Number.isInteger(body.count) && body.count > 0
    ? body.count
    : 1;

  const bagIndex = findIndex(
    currentUser.bag,
    (o: any) => o.item._id.toString() === itemId
  );

  if (bagIndex === -1 || !currentUser.bag[bagIndex] || currentUser.bag[bagIndex].count <= 0) {
    return c.json({ message: 'You searched everywhere, but can not find this item.' }, 400);
  }

  const bagEntry = currentUser.bag[bagIndex];

  if (countToSell > bagEntry.count) {
    return c.json({ message: `You only have ${bagEntry.count} of that item.` }, 400);
  }

  const itemDoc = await items.findOne({ _id: itemId }).lean();
  if (!itemDoc) {
    return c.json({ message: 'Item not found.' }, 404);
  }

  const saleValue = (itemDoc.value ?? 0) * countToSell;

  if (countToSell >= bagEntry.count) {
    await apiKeys.updateOne(
      { apiKey: currentUser.apiKey },
      {
        $pull: { bag: { item: bagEntry.item._id } } as any,
        $inc: { gold: saleValue },
      }
    );
  } else {
    await apiKeys.updateOne(
      { apiKey: currentUser.apiKey, 'bag.item': bagEntry.item._id },
      {
        $inc: { 'bag.$.count': -countToSell, gold: saleValue },
      }
    );
  }

  return c.json({
    message: `You sold ${countToSell}x ${itemDoc.name} for ${saleValue} gold.`,
    goldEarned: saleValue,
  }, 200);
};
