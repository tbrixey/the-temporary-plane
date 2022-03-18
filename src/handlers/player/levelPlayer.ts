import { Response } from "express";
import { client, dbName } from "../../mongo";
import { ExpressRequest, User } from "../../types";

type Stats = "str" | "con" | "int" | "dex" | "luck";

const updateStat = (user: User, stat: Stats) => {
  user.stats[stat] += 1;
  return user;
};

const updateSpeed = (user: User) => {
  user.speed += 2;
  return user;
};

const updateWeight = (user: User) => {
  user.weight += 3;
  return user;
};

const levelMap = new Map([
  ["str", (user: User) => updateStat(user, "str")],
  ["dex", (user: User) => updateStat(user, "dex")],
  ["int", (user: User) => updateStat(user, "int")],
  ["con", (user: User) => updateStat(user, "con")],
  ["luck", (user: User) => updateStat(user, "luck")],
  ["speed", (user: User) => updateSpeed(user)],
  ["weight", (user: User) => updateWeight(user)],
]);

export const levelPlayer = async (req: ExpressRequest, res: Response) => {
  const user = req.body.currentUser;
  const toLevel = req.params.toLevel;
  if (!user.levelPointsToUse || user.levelPointsToUse <= 0) {
    return res
      .status(400)
      .json({ message: "You don't have any level points to use." });
  }

  if (!levelMap.has(toLevel)) {
    return res
      .status(400)
      .json({ message: "Invalid item to level: " + toLevel });
  }

  levelMap.get(toLevel)(user);
  const newHP = 5 + user.stats.con;

  user.maxHitpoints += newHP;
  user.hitpoints += newHP;
  user.levelPointsToUse -= 1;

  const collection = client.db(dbName).collection("apiKeys");
  await collection.updateOne(
    { apiKey: user.apiKey },
    {
      $set: user,
    }
  );

  return res.status(200).json({ message: "You leveled up!", user });
};
