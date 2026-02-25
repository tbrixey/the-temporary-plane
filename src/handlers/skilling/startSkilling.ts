import { Context } from 'hono';
import moment from 'moment';
import apiKeys from '../../mongo/schemas/apiKeys';
import skilling from '../../mongo/schemas/skilling';
import skills from '../../mongo/schemas/skills';
import { User } from '../../types';

interface SkillingBody {
  skillName: string;
  item: string;
  count?: number;
}

interface FindObject {
  location: string;
  skill: string;
  level: { $lte: number };
  itemName?: string;
}

export const startSkilling = async (c: Context) => {
  const currentUser = c.get('currentUser') as User;
  const { skillName: skill, item, count = 1 } = await c.req.json<SkillingBody>();

  if (!skill || !item) {
    return c.json({
      message: `invalid request. Missing either skillName or item in the body.`,
    }, 400);
  }

  const findObj: FindObject = {
    location: currentUser.location.name,
    skill,
    level: { $lte: currentUser.level },
    itemName: item.toLowerCase(),
  };

  console.log(findObj);

  const skillList = await skills.find(findObj);

  if (skillList.length === 0) {
    return c.json({ message: `Unable to work on ${skill} here.` }, 200);
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

  return c.json({
    message: `Started working on ${skill} getting ${item}`,
  }, 200);
};