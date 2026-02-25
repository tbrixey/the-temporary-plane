import { Context, Next } from 'hono';

export const isPlayerInCity = async (
  c: Context,
  next: Next
) => {
  const currentUser = c.get('currentUser');

  if (currentUser?.location?.type === 'city') {
    return next();
  } else {
    return c.json({ message: 'Must be located in a city to run this command.' }, 400);
  }
};