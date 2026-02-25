import { Context } from 'hono';
import { find } from 'lodash';
import locations from '../../mongo/schemas/locations';
import { ExpressRequest } from '../../types/express';

// This provies class info when requested

export const travelInfo = async (
  c: Context<{}, { destination: string }>
) => {
  const currentUser = c.get('currentUser');
  const destination = c.req.param('destination');
  if (!destination) {
    return c.json({ message: 'Missing destination' }, 400);
  }

  if (destination === currentUser.location.name) {
    return c.json({ message: 'Currently at destination' }, 400);
  }

  const destLocation = await locations.findOne({
    name: destination,
  });

  if (!destLocation) {
    return c.json({
      message: "Location not found. Check for locations using '/api/locations'",
    }, 404);
  }

  if (!currentUser.location) {
    return c.json({
      message:
        "Users location not found. Please reach out to support if you can't travel in a few minutes.",
    }, 404);
  }

  const x = currentUser.location.x - destLocation.x;
  const y = currentUser.location.y - destLocation.y;

  const length = Math.hypot(x, y);
  const travelTime = parseFloat((length / 2 / currentUser.speed).toFixed(2));

  return c.json({
    message: `It will take approximately ${(travelTime * 100).toFixed(
      0
    )} seconds to get to ${destination}`,
  }, 200);
};