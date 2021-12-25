import { Response } from "express";
import { find, findIndex } from "lodash";
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

        console.log("EFFECT", effect);

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
                .json({ message: "Player is already at max health" });
            }
            break;
          case "stats":
            console.log("INSIDE", currentUser.bag[itemIndex]);
            setField.$inc = {
              "bag.$[elem].count": -1,
            };
            arrayFilters.arrayFilters = [{ "elem.id": itemId }];
            break;
        }
      }
    }

    // const updateResponse = await playerCollection.findOneAndUpdate(
    //   {
    //     apiKey: currentUser.apiKey,
    //   },
    //   setField,
    //   arrayFilters
    // );

    return res
      .status(200)
      .json({ message: "Player used " + currentUser.bag[itemIndex].name });
  } else {
    return res
      .status(400)
      .json({ message: "Player does not have item to use." });
  }
};
