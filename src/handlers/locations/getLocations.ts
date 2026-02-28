import { Context } from 'hono';
import location from '../../mongo/schemas/locations';
import { AppEnv } from '../../types/express';

export const getLocations = async (
  c: Context<AppEnv>
) => {
  const cities = await location.find({ type: { $ne: 'questlocation' } });

  return c.json(cities, 200);
};