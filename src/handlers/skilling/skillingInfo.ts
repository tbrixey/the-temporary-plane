import { Response } from "express";
import { isNumber } from "lodash";
import { client, dbName } from "../../mongo";
import { ExpressRequest } from "../../types";

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

export const skillingInfo = async (req: ExpressRequest, res: Response) => {
  const filters: SkillingQuery = req.query;
  const findObj: SkillSearchObj = {};

  if (filters.skill) findObj.skill = filters.skill;
  if (filters.location) findObj.location = filters.location;
  if (filters.level && isNumber(filters.level))
    findObj.level = { $lte: parseInt(filters.level) };

  const collection = client.db(dbName).collection("skills");

  const skills = await collection.find(findObj).toArray();

  if (skills.length === 0) {
    return res
      .status(200)
      .json({ message: "There are no skills matching your criteria." });
  }

  res.status(200).json({ data: skills });
};
