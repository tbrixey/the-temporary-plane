import { NextFunction, Request, Response } from "express";
import { ExpressRequest } from "../types/express";
import { client, dbName } from "../mongo";

export const checkPlayerTravel = async (
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.body.currentUser) {
    const currentUser = req.body.currentUser;

    if (currentUser.arrivalTime) {
      const date = new Date();

      const travelCollection = client.db(dbName).collection("traveling");
      const userCollection = client.db(dbName).collection("apiKeys");
      const traveler = await travelCollection.findOne({
        playerName: currentUser.playerName,
      });

      if (traveler) {
        if (currentUser.arrivalTime >= date) {
          return res
            .status(200)
            .json({ message: `Currently in transit to ${traveler.to.name}.` });
        } else {
          await travelCollection.deleteOne({
            playerName: currentUser.playerName,
          });
          await userCollection.findOneAndUpdate(
            { apiKey: currentUser.apiKey },
            {
              $set: { location: traveler.to.name },
              $unset: { arrivalTime: "" },
            }
          );
          req.body.currentUser.location = traveler.to.name;
          return next();
        }
      } else {
        await userCollection.findOneAndUpdate(
          { apiKey: currentUser.apiKey },
          { $unset: { arrivalTime: "" } }
        );
      }
    }

    return next();
  }
};
