import { Response } from "express";
import { isNumber } from "lodash";
import { client, dbName } from "../../mongo";
import { ExpressRequest } from "../../types";

export const skilling = async (req: ExpressRequest, res: Response) => {
  const currentUser = req.body.currentUser;

  const collection = client.db(dbName).collection("skills");

  // const skills = await collection.find(findObj).toArray();

  res
    .status(200)
    .json({ message: `Started working on ${req.params.skillName}` });
};
