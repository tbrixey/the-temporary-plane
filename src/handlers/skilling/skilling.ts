import { Response } from "express";
import moment from "moment";
import { client, dbName } from "../../mongo";
import { ExpressRequest } from "../../types";

interface SkillingBody {
  skillName: string;
  item: string;
  count: number;
}

interface FindObject {
  location: string;
  skill: string;
  level: { $lte: number };
  itemName?: string;
}

export const skilling = async (
  req: ExpressRequest<SkillingBody>,
  res: Response
) => {
  const { currentUser, skillName: skill, item, count = 1 } = req.body;

  if (!skill || !item) {
    return res.status(400).json({
      message: `invalid request. Missing either skillName or item in the body.`,
    });
  }

  const findObj: FindObject = {
    location: currentUser.location,
    skill,
    level: { $lte: currentUser.level },
    itemName: item.toLowerCase(),
  };

  console.log(findObj);

  const collection = client.db(dbName).collection("skills");
  const skills = await collection.find(findObj).toArray();

  if (skills.length === 0) {
    return res
      .status(200)
      .json({ message: `Unable to work on ${skill} here.` });
  }

  const now = new Date();
  const finishTime = moment(now)
    .add(skills[0].time * count, "s")
    .toDate();

  const skillingCollection = client.db(dbName).collection("skilling");
  const userCollection = client.db(dbName).collection("apiKeys");

  await userCollection.findOneAndUpdate(
    { apiKey: currentUser.apiKey },
    { $set: { finishTime } }
  );

  await skillingCollection.insertOne({
    playerName: currentUser.playerName,
    skill,
    finishTime,
    count,
  });

  res.status(200).json({
    message: `Started working on ${skill} getting ${item}`,
  });
};
