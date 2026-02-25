import { Context } from 'hono';
import { Quest } from './quest';
import { Location } from './';
import { Item } from './items';

export interface User {
  _id: string;
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
    item: Item;
    count: number;
    _id: string;
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
    [key: string]: number;
  };
  weight: number;
  arrivalTime?: Date;
  finishTime?: Date;
  levelPointsToUse?: number;
  bonusStats?: {
    stats?: {
      [key: string]: number;
    };
    speed?: number;
    weight?: number;
    time?: Date;
  };
}
export interface AppEnv {
  Variables: {
    currentUser: User;
    questsComplete: string[];
  };
}

/** @deprecated Use Context<AppEnv> or Context directly with c.get('currentUser') */
export type ExpressRequest<Body = {}, Params = any> = Context<
  AppEnv,
  string,
  Params
>;