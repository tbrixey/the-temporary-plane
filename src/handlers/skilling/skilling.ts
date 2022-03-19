import { Response } from "express";
import { client, dbName } from "../../mongo";
import { ExpressRequest } from "../../types";

interface FindObject {
  location: string;
  skill: string;
  level: { $lte: number };
  itemName?: string;
}

export const skilling = async (req: ExpressRequest, res: Response) => {
  const currentUser = req.body.currentUser;
  const skill = req.params.skillName;
  const itemToGet = req.params.item;

  const findObj: FindObject = {
    location: currentUser.location,
    skill,
    level: { $lte: currentUser.level },
  };

  if (itemToGet) findObj.itemName = itemToGet;

  const collection = client.db(dbName).collection("skills");
  const skills = await collection.find(findObj).toArray();

  console.log("skills", skills);

  if (skills.length === 0) {
    return res
      .status(200)
      .json({ message: `Unable to work on ${skill} here.` });
  }

  res.status(200).json({
    message: `Started working on ${skill} getting ${itemToGet}`,
  });
};
