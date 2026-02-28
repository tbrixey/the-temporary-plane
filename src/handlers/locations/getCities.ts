import { Context } from 'hono';
import location from '../../mongo/schemas/locations';

const LOCATION_TYPES = ['city', 'poi', 'town', 'village', 'outpost', 'questlocation'] as const;
type LocationType = (typeof LOCATION_TYPES)[number];

interface LocationQuery {
  name?: string;
  population?: string;
  type?: string;
}

function isValidLocationType(value: string): value is LocationType {
  return LOCATION_TYPES.includes(value as LocationType);
}

export const getCities = async (c: Context) => {
  const filters = c.req.query() as LocationQuery;
  const findObj: {
    name?: { $regex: string; $options: string };
    population?: number;
    type?: { $ne: string } | LocationType;
  } = {};

  if (filters.type && isValidLocationType(filters.type)) {
    findObj.type = filters.type;
  } else {
    // Exclude questlocations by default
    findObj.type = { $ne: 'questlocation' };
  }

  if (filters.name) findObj.name = { $regex: filters.name, $options: 'i' };

  if (filters.population) findObj.population = parseInt(filters.population);

  const locations = await location.find(findObj);

  return c.json({ data: locations }, 200);
};
