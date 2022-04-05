import { Response } from 'express';
import moment from 'moment';
import apiKeys from '../../mongo/schemas/apiKeys';
import skilling from '../../mongo/schemas/skilling';
import skills from '../../mongo/schemas/skills';
import { ExpressRequest } from '../../types';

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

export const startSkilling = async (
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
    location: currentUser.location.name,
    skill,
    level: { $lte: currentUser.level },
    itemName: item.toLowerCase(),
  };

  console.log(findObj);

  const skillList = await skills.find(findObj);

  if (skills.length === 0) {
    return res
      .status(200)
      .json({ message: `Unable to work on ${skill} here.` });
  }

  const now = new Date();
  const finishTime = moment(now)
    .add(skillList[0].time * count, 's')
    .toDate();

  await apiKeys.findOneAndUpdate(
    { apiKey: currentUser.apiKey },
    { $set: { finishTime } }
  );

  await skilling.create({
    playerName: currentUser.playerName,
    skill,
    finishTime,
    count,
  });

  res.status(200).json({
    message: `Started working on ${skill} getting ${item}`,
  });
};
