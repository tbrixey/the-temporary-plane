import { Response } from "express";
import { client, dbName } from "../../mongo";
import { ExpressRequest } from "../../types";

interface CityQuery {
  name?: string;
  population?: string;
  type?: string;
}

export const getCities = async (
  req: ExpressRequest<{}, CityQuery>,
  res: Response
) => {
  const filters = req.query;
  const findObj: {
    name?: { $regex: string; $options: string };
    population?: number;
    type: string;
  } = {
    type: "city",
  };

  const collection = client.db(dbName).collection("locations");

  if (filters.name) findObj.name = { $regex: filters.name, $options: "i" };

  if (filters.population) findObj.population = parseInt(filters.population);

  const cities = await collection.find(findObj).toArray();

  res.status(200).json({ data: cities });
};
