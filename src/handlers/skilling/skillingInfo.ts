import { Context } from 'hono';
import { isNumber } from 'lodash';
import skills from '../../mongo/schemas/skills';
import { ExpressRequest } from '../../types';

interface SkillingQuery {
  skill?: string;
  level?: string;
  location?: string;
}

interface SkillSearchObj {
  location?: string;
  skill?: string;
  level?: { $lte: number };
}

export const skillingInfo = async (c: Context) => {
  const filters: SkillingQuery = c.req.query;
  const findObj: SkillSearchObj = {};

  if (filters.skill) findObj.skill = filters.skill;
  if (filters.location) findObj.location = filters.location;
  if (filters.level && isNumber(filters.level))
    findObj.level = { $lte: parseInt(filters.level) };

  const skillList = await skills.find(findObj);

  if (skillList.length === 0) {
    return c.json({ message: 'There are no skills matching your criteria.' }, 200);
  }

  return c.json({ data: skillList }, 200);
};