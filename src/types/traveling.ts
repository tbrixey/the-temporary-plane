import { Location } from './location';

export interface Traveling {
  _id: string;
  playerName: string;
  from: Location;
  to: Location;
  arrivalTime: Date;
}
