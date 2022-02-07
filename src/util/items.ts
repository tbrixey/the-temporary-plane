import { find } from "lodash";
import { Collection, Document } from "mongodb";
import { User } from "../types";

export const itemsToAdd = (
  user: User,
  givenItems: { id: number; count: number }[],
  collection: Collection<Document>
) => {
  givenItems.forEach((item) => {
    const found = find(user.bag, { id: item.id });
    if (found) {
      collection.updateOne(
        {
          apiKey: user.apiKey,
          "bag.id": item.id,
        },
        {
          $inc: {
            "bag.$.count": item.count,
          },
        }
      );
    } else {
      collection.updateOne(
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