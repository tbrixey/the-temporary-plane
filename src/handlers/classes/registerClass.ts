import { Context } from 'hono';
import apiKeys from '../../mongo/schemas/apiKeys';
import classes from '../../mongo/schemas/classes';

// This registers a user to a specific class

export const registerClass = async (c: Context) => {
  const className = c.req.param('className');

  if (!className) {
    return c.json({ message: 'Missing class' }, 400);
  }

  const classFound = await classes.findOne({
    name: className,
  });

  if (!classFound) {
    return c.json({ message: 'Class not found' }, 400);
  }

  const currentUser = c.get('currentUser');

  if (currentUser.class) {
    return c.json({ message: 'Player already has a class' }, 400);
  } else {
    const statBoost: { [key: string]: number } = {
      str: 0,
      con: 0,
      dex: 0,
      int: 0,
      luck: 0,
    };

    switch (className) {
      case 'Fighter':
        statBoost.str = 1;
        statBoost.con = 1;
        break;
      case 'Rogue':
        statBoost.dex = 2;
        break;
      case 'Mage':
        statBoost.int = 2;
        break;
      case 'Cleric':
        statBoost.int = 1;
        statBoost.luck = 1;
        break;
      case 'Ranger':
        statBoost.dex = 1;
        statBoost.con = 1;
        break;
    }

    const newDoc = await apiKeys.findOneAndUpdate(
      { apiKey: currentUser.apiKey },
      {
        $set: {
          class: className,
          weight: classFound.weight,
          speed: classFound.speed,
          updatedOn: new Date(),
          stats: statBoost,
        },
      },
      { returnDocument: 'after' }
    );
    return c.json({
      data: { ...newDoc },
      message: 'Class selected! Pick a race using /api/race/<racename>',
    }, 200);
  }
};