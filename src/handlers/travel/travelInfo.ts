import { Request, Response } from "express";
import { client, dbName } from "../../mongo";
import { find } from "lodash";
import moment from "moment";

// This provies class info when requested

export const travelInfo = async (req: Request, res: Response) => {
  const currentUser = req.body.currentUser;
  const destination = req.params.destination;
  if (!destination) {
    return res.status(400).json({ message: "Missing destination" });
  }

  const collection = client.db(dbName).collection("locations");

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
  const travelTime = (length / 2 / currentUser.speed).toFixed(2);

  const now = moment();
  const timeToArrival = moment().add(travelTime, "m");

  const travelText = now.to(timeToArrival, true);

  return res.status(200).json({
    message: `It will take ${travelText} to get to ${destination}`,
  });
};
