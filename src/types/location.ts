export type LocationType = 'city' | 'town' | 'village' | 'outpost' | 'poi' | 'questlocation';

export interface Location {
  _id: string;
  name: string;
  description?: string;
  type: LocationType;
  x: number;
  y: number;
  population: number;
}
