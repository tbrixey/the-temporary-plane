import { NextFunction, Response } from "express";
import { client, dbName } from "../mongo";
import { ExpressRequest } from "../types";

export const isPlayerInCity = async (
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) => {
  const user = req.body.currentUser;

  const locationCol = client.db(dbName).collection("locations");

  const location = await locationCol.findOne({ name: user.location });

  if (location.type === "city") {
    next();
  } else {
    return res
      .status(400)
      .json({ message: "Must be located in a city to run this command." });
  }
};
