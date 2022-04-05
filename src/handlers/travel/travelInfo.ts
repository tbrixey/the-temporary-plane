import { Response } from 'express';
import { find } from 'lodash';
import locations from '../../mongo/schemas/locations';
import { ExpressRequest } from '../../types/express';

// This provies class info when requested

export const travelInfo = async (
  req: ExpressRequest<{}, { destination: string }>,
  res: Response
) => {
  const currentUser = req.body.currentUser;
  const destination = req.params.destination;
  if (!destination) {
    return res.status(400).json({ message: 'Missing destination' });
  }

  if (destination === currentUser.location.name) {
    return res.status(400).json({ message: 'Currently at destination' });
  }

  const destLocation = await locations.findOne({
    name: destination,
  });

  if (!destLocation) {
    return res.status(404).json({
      message: "Location not found. Check for locations using '/api/locations'",
    });
  }

  if (!currentUser.location) {
    return res.status(404).json({
      message:
        "Users location not found. Please reach out to support if you can't travel in a few minutes.",
    });
  }

  const x = currentUser.location.x - destLocation.x;
  const y = currentUser.location.y - destLocation.y;

  const length = Math.hypot(x, y);
  const travelTime = parseFloat((length / 2 / currentUser.speed).toFixed(2));

  return res.status(200).json({
    message: `It will take approximately ${(travelTime * 100).toFixed(
      0
    )} seconds to get to ${destination}`,
  });
};
