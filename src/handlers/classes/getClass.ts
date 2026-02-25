import { Context } from 'hono';
import classes from '../../mongo/schemas/classes';

// This provies class info when requested

export const getClass = async (c: Context) => {
  const allClasses = await classes.find({}, { _id: 0 });

  return c.json({ data: allClasses }, 200);
};