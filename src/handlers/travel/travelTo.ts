import { Context } from 'hono';
import { find } from 'lodash';
import moment from 'moment';
import { ObjectId } from 'mongodb';
import apiKeys from '../../mongo/schemas/apiKeys';
import locations from '../../mongo/schemas/locations';
import traveling from '../../mongo/schemas/traveling';
import { ExpressRequest } from '../../types/express';

// This provies class info when requested

export const travelTo = async (
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

  const negOrPos = Math.ceil((Math.random() - 0.5) * 2) < 1 ? -1 : 1;
  const randomDeviations = (Math.random() * (0.25 - 0.02) + 0.02) * negOrPos;
  const newTime = travelTime + parseFloat(randomDeviations.toFixed(2));

  const now = new Date();
  const timeToArrival = moment(now).add(newTime, 'm').toDate();

  await apiKeys.findOneAndUpdate(
    { apiKey: currentUser.apiKey },
    { $set: { arrivalTime: timeToArrival } }
  );

  const fromId = new ObjectId(currentUser.location._id);
  const toId = new ObjectId(destLocation._id);

  await traveling.create({
    playerName: currentUser.playerName,
    from: fromId,
    to: toId,
    arrivalTime: timeToArrival,
  });

  return c.json({
    message: `It will take ${(newTime * 100).toFixed(
      0
    )} seconds to get to ${destination}`,
    time: (newTime * 100).toFixed(0),
  }, 200);
};