import { keyBy, keys, merge, values } from "lodash";
import { Collection, Document } from "mongodb";

export const mergeBag = (collection: Document) => {
  if (!collection.bag && !collection.items) {
    console.warn("MergeBag function: missing bag or items in collection");
    return collection;
  }
  const mergedBag = values(
    merge(keyBy(collection.bag, "id"), keyBy(collection.items, "id"))
  );
  collection.bag = mergedBag;
  delete collection.items;
  return collection;
};

export const addBonusStats = async (
  playerCollection: any,
  collection: Collection<Document>
) => {
  if (!playerCollection.bonusStats) {
    return playerCollection;
  }

  const date = new Date();

  if (playerCollection.bonusStats.time < date) {
    delete playerCollection.bonusStats;

    await collection.findOneAndUpdate(
      { apiKey: playerCollection.apiKey },
      { $unset: { bonusStats: "" } }
    );

    return playerCollection;
  }

  const bonusKeys = keys(playerCollection.bonusStats);

  switch (bonusKeys[0]) {
    case "stats":
      const stat = keys(playerCollection.bonusStats.stats);
      playerCollection.stats[stat[0]] +=
        playerCollection.bonusStats.stats[stat[0]];
      break;
    case "speed":
      playerCollection.speed += playerCollection.bonusStats.speed;
      break;
    case "weight":
      playerCollection.weight += playerCollection.bonusStats.weight;
      break;
  }

  return playerCollection;
};
