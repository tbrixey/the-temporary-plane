import { Response } from 'express';
import location from '../../mongo/schemas/locations';
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
  const cities = await location.find();

  res.status(200).json(cities);
};
