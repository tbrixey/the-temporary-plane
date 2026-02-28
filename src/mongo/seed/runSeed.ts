import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';

type Doc = Record<string, unknown>;

/**
 * Reads a JSON seed file and upserts each document into the given Mongoose model.
 * Uses the supplied keys to build the filter for each document (idempotent by those keys).
 *
 * @param model - Mongoose model (collection)
 * @param dataFileName - Filename in src/mongo/seed/data/ (e.g. 'locations.json')
 * @param upsertKeys - Fields to use as the unique filter (e.g. ['name'] or ['name', 'x', 'y'])
 * @param prepare - Optional function to transform each doc before upsert (e.g. convert string IDs to ObjectId)
 */
export async function runSeed<T extends Doc>(
  model: mongoose.Model<unknown>,
  dataFileName: string,
  upsertKeys: (keyof T)[],
  prepare?: (doc: T) => T
): Promise<void> {
  const dataPath = path.join(__dirname, 'data', dataFileName);
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const data = JSON.parse(raw) as T[];

  if (!Array.isArray(data) || data.length === 0) {
    return;
  }

  const operations: mongoose.mongo.BulkWriteOperation<mongoose.mongo.BSON.Document>[] = data.map(
    (doc) => {
      const prepared = prepare ? prepare({ ...doc }) : (doc as Doc);
      const filter: Doc = {};
      for (const key of upsertKeys) {
        let value = prepared[key];
        if (key === '_id' && typeof value === 'string') {
          value = new mongoose.Types.ObjectId(value);
        }
        filter[key as string] = value;
      }
      return {
        updateOne: {
          filter,
          update: { $set: prepared },
          upsert: true,
        },
      };
    }
  );

  await model.bulkWrite(operations);
}
