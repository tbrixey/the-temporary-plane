import { RequestHandler } from "express";
import { client, dbName } from "../../mongo";

interface CityQuery {
  name?: string;
  population?: string;
  type?: string;
}

export const getLocations: RequestHandler<{}, any, any, CityQuery> = async (
  req,
  res
) => {
  const collection = client.db(dbName).collection("locations");

  const cities = await collection.find().toArray();

  res.status(200).json(cities);
};
