import { Context } from 'hono';
import location from '../../mongo/schemas/locations';
import { AppEnv } from '../../types/express';
import { Quest } from '../../types/quest';

export const getLocations = async (
  c: Context<AppEnv>
) => {
  const cities = await location.find({ type: { $ne: 'questlocation' } });

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
      cities.push(...questLocations);
    }
  }

  return c.json(cities, 200);
};