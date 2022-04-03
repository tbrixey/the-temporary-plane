import { Request, Response } from "express";
import { find } from "lodash";
import moment from "moment";
import { client, dbName } from "../../mongo";
import { ExpressRequest } from "../../types/express";

// This provies class info when requested

export const travelTo = async (
  req: ExpressRequest<{}, { destination: string }>,
  res: Response
) => {
  const currentUser = req.body.currentUser;
  const destination = req.params.destination;
  if (!destination) {
    return res.status(400).json({ message: "Missing destination" });
  }

  if (destination === currentUser.location) {
    return res.status(400).json({ message: "Currently at destination" });
  }

  const collection = client.db(dbName).collection("locations");
  const userCollection = client.db(dbName).collection("apiKeys");
  const travelCollection = client.db(dbName).collection("traveling");

  const location = await collection
    .find({
      $or: [{ name: destination }, { name: currentUser.location }],
    })
    .toArray();

  const userLocation = find(location, { name: currentUser.location });
  const destLocation = find(location, { name: destination });

  if (!destLocation) {
    return res.status(404).json({
      message: "Location not found. Check for locations using '/api/locations'",
    });
  }

  if (!userLocation) {
    return res.status(404).json({
      message:
        "Users location not found. Please reach out to support if you can't travel in a few minutes.",
    });
  }

  const x = userLocation.x - destLocation.x;
  const y = userLocation.y - destLocation.y;

  const length = Math.hypot(x, y);
  const travelTime = parseFloat((length / 2 / currentUser.speed).toFixed(2));

  const negOrPos = Math.ceil((Math.random() - 0.5) * 2) < 1 ? -1 : 1;
  const randomDeviations = (Math.random() * (0.25 - 0.02) + 0.02) * negOrPos;
  const newTime = travelTime + parseFloat(randomDeviations.toFixed(2));

  const now = new Date();
  const timeToArrival = moment(now).add(newTime, "m").toDate();

  await userCollection.findOneAndUpdate(
    { apiKey: currentUser.apiKey },
    { $set: { arrivalTime: timeToArrival } }
  );

  await travelCollection.insertOne({
    playerName: currentUser.playerName,
    from: userLocation,
    to: destLocation,
    arrivalTime: timeToArrival,
  });

  return res.status(200).json({
    message: `It will take ${(newTime * 100).toFixed(
      0
    )} seconds to get to ${destination}`,
  });
};
