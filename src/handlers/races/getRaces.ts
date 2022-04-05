import { Request, Response } from 'express';
import races from '../../mongo/schemas/races';

export const getRaces = async (req: Request, res: Response) => {
  const raceList = await races.find();

  res.status(200).json({ data: raceList });
};
