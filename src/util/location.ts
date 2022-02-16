import { User } from "../types";
import { client, dbName } from "../mongo";

export const getPlayerLocation = async (user: User) => {
  const locationCol = client.db(dbName).collection("locations");

  const location = await locationCol.find({ name: user.location });

  return location;
};
