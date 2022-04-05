import { Response } from 'express';
import { client, dbName } from '../../mongo';
import { ExpressRequest } from '../../types';

interface CityQuery {
  name?: string;
  population?: string;
  type?: string;
}

export const getLocations = async (
  req: ExpressRequest<{}, CityQuery>,
  res: Response
) => {
  const collection = client.db(dbName).collection('locations');

  const cities = await collection.find().toArray();

  res.status(200).json(cities);
};
