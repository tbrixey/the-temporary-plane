import { Response } from "express";
import moment from "moment";
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

  if (!skill || !itemToGet) {
    return res.status(400).json({
      message: `invalid request. Missing either /:skillName or /:item`,
    });
  }

  const findObj: FindObject = {
    location: currentUser.location,
    skill,
    level: { $lte: currentUser.level },
    itemName: itemToGet.toLowerCase(),
  };

  console.log(findObj);

  const collection = client.db(dbName).collection("skills");
  const skills = await collection.find(findObj).toArray();

  console.log("skills", skills);

  if (skills.length === 0) {
    return res
      .status(200)
      .json({ message: `Unable to work on ${skill} here.` });
  }

  const now = new Date();
  const finishTime = moment(now).add(skills[0].time, "s").toDate();

  const skillingCollection = client.db(dbName).collection("skilling");

  // await skillingCollection.insertOne({
  //   playerName: currentUser.playerName,
  //   skill,
  //   finishTime,
  //   count,
  // });

  res.status(200).json({
    message: `Started working on ${skill} getting ${itemToGet}`,
  });
};
