import { Context, Next } from 'hono';
import { ExpressRequest } from '../types/express';

export const characterCreationComplete = async (
  c: Context,
  next: Next
) => {
  const currentUser = c.get('currentUser');

  if (currentUser) {
    if (!currentUser.class) {
      return c.json({
        message:
          'Please choose a class. Pick a class using /api/class/<classname>',
      });
    }
    if (!currentUser.race) {
      return c.json({
        message: 'Please choose a race. Pick a race using /api/race/<racename>',
      });
    }
    if (!currentUser.startingLocation) {
      return c.json({
        message:
          'Please choose a starting location. Pick a starting city /api/city/<racename>',
      });
    }

    return next();
  }
};