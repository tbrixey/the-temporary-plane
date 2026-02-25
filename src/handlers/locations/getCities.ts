import { Context } from 'hono';
import location from '../../mongo/schemas/locations';
import { ExpressRequest } from '../../types';

interface CityQuery {
  name?: string;
  population?: string;
  type?: string;
}

export const getCities = async (
  c: Context<{}, CityQuery>
) => {
  const filters = c.req.query;
  const findObj: {
    name?: { $regex: string; $options: string };
    population?: number;
    type: string;
  } = {
    type: 'city',
  };

  if (filters.name) findObj.name = { $regex: filters.name, $options: 'i' };

  if (filters.population) findObj.population = parseInt(filters.population);

  const cities = await location.find(findObj);

  return c.json({ data: cities }, 200);
};