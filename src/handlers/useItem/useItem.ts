import { Response } from "express";
import { find, findIndex } from "lodash";
import moment from "moment";
import { client, dbName } from "../../mongo";
import { ExpressRequest } from "../../types/express";

export const useItem = async (req: ExpressRequest, res: Response) => {
  if (!req.params.itemId) {
    return res.status(400).json({ message: "Missing parameter playerName" });
  }

  const itemId = parseInt(req.params.itemId);
  const currentUser = req.body.currentUser;

  const itemIndex = findIndex(currentUser.bag, { id: itemId });

  const playerCollection = client.db(dbName).collection("apiKeys");

  // console.log("CURRENT", itemIndex);

  if (currentUser.bag[itemIndex] && currentUser.bag[itemIndex].count > 0) {
    const setField: any = {};
    const arrayFilters: any = {};
    if (currentUser.bag[itemIndex].type === "consumable") {
      if (currentUser.bag[itemIndex].effect) {
        const effect = Object.keys(currentUser.bag[itemIndex].effect);
        const now = new Date();

        switch (effect[0]) {
          case "hitpoints":
            if (currentUser.hitpoints < currentUser.maxHitpoints) {
              const newHitpoint =
                currentUser.hitpoints +
                  currentUser.bag[itemIndex].effect.hitpoints >
                currentUser.maxHitpoints
                  ? currentUser.maxHitpoints
                  : currentUser.hitpoints +
                    currentUser.bag[itemIndex].effect.hitpoints;

              setField.$set = {
                hitpoints: newHitpoint,
              };
              if (currentUser.bag[itemIndex].count - 1 <= 0) {
                setField.$pull = {
                  bag: { id: itemId },
                };
              } else {
                setField.$inc = {
                  "bag.$[elem].count": -1,
                };
                arrayFilters.arrayFilters = [{ "elem.id": itemId }];
              }
            } else {
              return res
                .status(200)
                .json({ message: "You are already at max health" });
            }
            break;
          case "stats":
            console.log("INSIDE", currentUser.bag[itemIndex]);
            setField.$inc = {
              "bag.$[elem].count": -1,
            };
            arrayFilters.arrayFilters = [{ "elem.id": itemId }];
            setField.$set = {
              bonusStats: {
                stats: statItem(currentUser.bag[itemIndex].effect.stats),
                time: moment(now)
                  .add(currentUser.bag[itemIndex].effect.time, "m")
                  .toDate(),
              },
            };
            break;
          case "speed":
          case "weight":
            const key = Object.keys(currentUser.bag[itemIndex].effect);
            setField.$inc = {
              "bag.$[elem].count": -1,
            };
            arrayFilters.arrayFilters = [{ "elem.id": itemId }];
            setField.$set = {
              bonusStats:
                key[0] === "speed"
                  ? { speed: currentUser.bag[itemIndex].effect.speed }
                  : { weight: currentUser.bag[itemIndex].effect.weight },
            };
            setField.$set.bonusStats.time = moment(now)
              .add(currentUser.bag[itemIndex].effect.time, "m")
              .toDate();
            break;
        }
      }
    } else if (currentUser.bag[itemIndex].type === "junk") {
      return res
        .status(200)
        .json({ message: "You can't use " + currentUser.bag[itemIndex].name });
    }

    if (setField.isEmpty) {
      await playerCollection.updateOne(
        {
          apiKey: currentUser.apiKey,
        },
        setField,
        arrayFilters
      );
    }

    return res
      .status(200)
      .json({ message: "You used " + currentUser.bag[itemIndex].name });
  } else {
    return res.status(400).json({ message: "You does not have item to use." });
  }
};

const statItem = (stat: { [key: string]: number }) => {
  const key = Object.keys(stat);

  switch (key[0]) {
    case "str":
      return { str: stat.str };
    case "con":
      return { con: stat.con };
    case "dex":
      return { dex: stat.dex };
    case "int":
      return { int: stat.int };
    case "luck":
      return { luck: stat.luck };
  }
};
