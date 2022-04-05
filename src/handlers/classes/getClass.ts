import { Request, Response } from 'express';
import classes from '../../mongo/schemas/classes';

// This provies class info when requested

export const getClass = async (req: Request, res: Response) => {
  const allClasses = await classes.find({}, { _id: 0 });

  res.status(200).json({ data: allClasses });
};
