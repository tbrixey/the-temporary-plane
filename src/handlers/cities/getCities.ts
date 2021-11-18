import { RequestHandler } from "express";
import { client, dbName } from "../../mongo";

interface CityQuery {
  name?: string;
  population?: string;
  type?: string;
}

export const getCities: RequestHandler<{}, any, any, CityQuery> = async (
  req,
  res
) => {
  const filters = req.query;
  const findObj: {
    name?: { $regex: string; $options: string };
    population?: number;
    type?: string;
  } = {};

  const collection = client.db(dbName).collection("cities");

  if (filters.name) findObj.name = { $regex: filters.name, $options: "i" };

  if (filters.population) findObj.population = parseInt(filters.population);

  if (filters.type) findObj.type = filters.type;

  const cities = await collection.find(findObj).toArray();

  res.status(200).json(cities);
};
