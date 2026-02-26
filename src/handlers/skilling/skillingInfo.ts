import { Context } from 'hono';
import skills from '../../mongo/schemas/skills';
import { AppEnv } from '../../types/express';

interface SkillSearchObj {
  location?: string;
  skill?: string;
  level?: { $lte: number };
}

export const skillingInfo = async (c: Context<AppEnv>) => {
  const filters = c.req.query();
  const findObj: SkillSearchObj = {};

  if (filters.skill) findObj.skill = filters.skill;
  if (filters.location) findObj.location = filters.location;
  const levelNum = filters.level ? parseInt(filters.level, 10) : NaN;
  if (!isNaN(levelNum)) findObj.level = { $lte: levelNum };

  const skillList = await skills.find(findObj);

  if (skillList.length === 0) {
    return c.json({ message: 'There are no skills matching your criteria.' }, 200);
  }

  return c.json({ data: skillList }, 200);
};