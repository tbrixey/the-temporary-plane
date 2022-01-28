import { Request, Response } from "express";
import * as core from "express-serve-static-core";

export interface User {
  apiKey: string;
  count: number;
  createdOn: Date;
  playerName: string;
  level: number;
  hitpoints: number;
  maxHitpoints: number;
  xpToNextLevel: number;
  gold: number;
  quests: {
    id: number;
    title: string;
    description: string;
    type: "intro" | "fetch" | "explore" | "fight";
    tasks?: string[];
    rewards: {
      gold: number;
      xp: number;
      items: {
        id: number;
        count: number;
      }[];
    };
  }[];
  updatedOn: Date;
  location: string;
  startingLocation: string;
  bag: {
    id: number;
    count: number;
    _id: any;
    name: string;
    description: string;
    effect?: {
      hitpoints?: number;
      speed?: number;
      weight?: number;
      time?: number;
      stats?: {
        str?: number;
        dex?: number;
        con?: number;
        int?: number;
        luck?: number;
      };
    };
    type: "consumable" | "junk" | "equipment";
    value: number;
    weight: number;
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
}
interface RequestUser {
  currentUser: User;
  questsComplete: any;
}

export type ExpressRequest = Request<core.ParamsDictionary, any, RequestUser>;
