import { Request, Response } from 'express';
import * as core from 'express-serve-static-core';
import { Quest } from './quest';
import { Location } from './';

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
  quests: Quest[];
  updatedOn: Date;
  location: Location;
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
    type: 'consumable' | 'junk' | 'equipment';
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
  arrivalTime?: Date;
  finishTime?: Date;
  levelPointsToUse?: number;
}
interface RequestUser {
  currentUser: User;
  questsComplete: any;
}

export type ExpressRequest<Body = {}, Params = any> = Request<
  core.ParamsDictionary,
  any,
  RequestUser & Body,
  Params
>;
