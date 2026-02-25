import { Context, Next } from 'hono';
import moment from 'moment';
import skilling from '../mongo/schemas/skilling';
import apiKeys from '../mongo/schemas/apiKeys';

export const checkPlayerSkillingStatus = async (
  c: Context,
  next: Next
) => {
  const currentUser = c.get('currentUser');

  if (currentUser) {
    if (currentUser.finishTime) {
      const date = new Date();

      const skiller = await skilling.findOne({
        playerName: currentUser.playerName,
      });

      if (skiller) {
        if (currentUser.finishTime >= date) {
          const dateNow = moment(date);
          const dateFinished = moment(currentUser.finishTime);
          return c.json({
            message: `Currently skilling ${
              skiller.skill
            }. Please wait until you finish in ${dateFinished.diff(
              dateNow,
              'seconds'
            )} seconds`,
          }, 200);
        } else {
          await skilling.deleteOne({
            playerName: currentUser.playerName,
          });
          const incString = 'skills.' + skiller.skill;
          await apiKeys.findOneAndUpdate(
            { apiKey: currentUser.apiKey },
            {
              $inc: { [incString]: skiller.count },
              $unset: { finishTime: '' },
            }
          );
          return next();
        }
      } else {
        await apiKeys.findOneAndUpdate(
          { apiKey: currentUser.apiKey },
          { $unset: { finishTime: '' } }
        );
      }
    }

    return next();
  }

  return next();
};