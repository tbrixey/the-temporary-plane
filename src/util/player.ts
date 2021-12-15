import { keyBy, merge, values } from "lodash";
import { Document } from "mongodb";

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
