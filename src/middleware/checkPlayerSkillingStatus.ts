import { NextFunction, Request, Response } from "express";
import { ExpressRequest } from "../types/express";
import { client, dbName } from "../mongo";
import moment from "moment";

export const checkPlayerSkillingStatus = async (
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.body.currentUser) {
    const currentUser = req.body.currentUser;

    if (currentUser.finishTime) {
      const date = new Date();

      const skillingCollection = client.db(dbName).collection("skilling");
      const userCollection = client.db(dbName).collection("apiKeys");
      const skiller = await skillingCollection.findOne({
        playerName: currentUser.playerName,
      });

      if (skiller) {
        if (currentUser.finishTime >= date) {
          const dateNow = moment(date);
          const dateFinished = moment(currentUser.finishTime);
          return res.status(200).json({
            message: `Currently skilling ${
              skiller.skill
            }. Please wait until you finish in ${dateFinished.diff(
              dateNow,
              "seconds"
            )} seconds`,
          });
        } else {
          await skillingCollection.deleteOne({
            playerName: currentUser.playerName,
          });
          const incString = "skills." + skiller.skill;
          await userCollection.findOneAndUpdate(
            { apiKey: currentUser.apiKey },
            {
              $inc: { [incString]: skiller.count },
              $unset: { finishTime: "" },
            }
          );
          return next();
        }
      } else {
        await userCollection.findOneAndUpdate(
          { apiKey: currentUser.apiKey },
          { $unset: { finishTime: "" } }
        );
      }
    }

    return next();
  }
};
