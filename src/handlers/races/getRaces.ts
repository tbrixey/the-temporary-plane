import { Context } from 'hono';
import races from '../../mongo/schemas/races';

export const getRaces = async (c: Context) => {
  const raceList = await races.find();

  return c.json({ data: raceList }, 200);
};