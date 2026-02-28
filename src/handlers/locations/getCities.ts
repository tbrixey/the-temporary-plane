import { Context } from 'hono';
import location from '../../mongo/schemas/locations';
import { AppEnv } from '../../types/express';
import { Quest } from '../../types/quest';

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

export const getCities = async (c: Context<AppEnv>) => {
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

  // When not filtering by type, append questlocations from the user's active quests
  const filteringByType = filters.type && isValidLocationType(filters.type);
  if (!filteringByType) {
    const user = c.get('currentUser');
    if (user?.quests?.length) {
      const questLocationNames = [
        ...new Set(
          (user.quests as Quest[])
            .map((q) => q.location)
            .filter((name): name is string => Boolean(name))
        ),
      ];
      if (questLocationNames.length > 0) {
        const questLocations = await location.find({
          name: { $in: questLocationNames },
          type: 'questlocation',
        });
        locations.push(...questLocations);
      }
    }
  }

  return c.json({ data: locations }, 200);
};
