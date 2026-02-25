import { Context } from 'hono';
import location from '../../mongo/schemas/locations';
import { ExpressRequest } from '../../types';

interface CityQuery {
  name?: string;
  population?: string;
  type?: string;
}

export const getLocations = async (
  c: Context<{}, CityQuery>
) => {
  const cities = await location.find();

  return c.json(cities, 200);
};