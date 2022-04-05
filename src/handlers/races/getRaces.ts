import { Request, Response } from 'express';
import { client, dbName } from '../../mongo';

export const getRaces = async (req: Request, res: Response) => {
  const collection = client.db(dbName).collection('races');

  const races = await collection.find().toArray();

  res.status(200).json({ data: races });
};
