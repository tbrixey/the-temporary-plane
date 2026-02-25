import { Context, Next } from 'hono';
import moment from 'moment';
import traveling from '../mongo/schemas/traveling';
import apiKeys from '../mongo/schemas/apiKeys';

export const checkPlayerTravel = async (
  c: Context,
  next: Next
) => {
  const currentUser = c.get('currentUser');

  if (currentUser) {
    if (currentUser.arrivalTime) {
      const date = new Date();

      const traveler = await traveling
        .findOne({
          playerName: currentUser.playerName,
        })
        .populate('to');

      if (traveler) {
        if (currentUser.arrivalTime >= date) {
          const dateNow = moment(date);
          const dateArrive = moment(currentUser.arrivalTime);
          return c.json({
            message: `Currently in transit to ${
              traveler.to.name
            }. Please wait until you arrive in ${dateArrive.diff(
              dateNow,
              'seconds'
            )} seconds`,
          }, 200);
        } else {
          await traveling.deleteOne({
            playerName: currentUser.playerName,
          });
          await apiKeys.findOneAndUpdate(
            { apiKey: currentUser.apiKey },
            {
              $set: { location: traveler.to._id },
              $unset: { arrivalTime: '' },
            }
          );
          c.set('currentUser', { ...currentUser, location: traveler.to });
          return next();
        }
      } else {
        await apiKeys.findOneAndUpdate(
          { apiKey: currentUser.apiKey },
          { $unset: { arrivalTime: '' } }
        );
      }
    }

    return next();
  }

  return next();
};