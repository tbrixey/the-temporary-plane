export type LocationType = 'city' | 'town' | 'village' | 'outpost' | 'poi';

export interface Location {
  _id: string;
  name: string;
  description?: string;
  type: LocationType;
  x: number;
  y: number;
  population: number;
}
