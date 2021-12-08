import { Request, Response } from "express";
import * as core from "express-serve-static-core";

interface User {
  currentUser: {
    apiKey: string;
    count: number;
    createdOn: Date;
    playerName: string;
    level: number;
    updatedOn: Date;
    location: string;
    startingLocation: string;
    bag: {
      id: number;
      count: number;
    }[];
    race: string;
    skills: {
      mining: number;
      woodcutting: number;
      arcana: number;
      cooking: number;
      gathering: number;
    };
    class: string;
    speed: number;
    stats: {
      str: number;
      con: number;
      dex: number;
      int: number;
      luck: number;
    };
    weight: number;
    arrivalTime: Date;
  };
}

export type ExpressRequest = Request<core.ParamsDictionary, any, User>;