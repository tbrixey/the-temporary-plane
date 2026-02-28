import { Item } from './items';

export interface Quest {
  _id: string;
  title: string;
  description: string;
  type: 'intro' | 'fetch' | 'explore' | 'kill';
  goto?: string;
  acquire?: Item;
  location?: string;
  target?: string;   // kill: monster name
  count?: number;    // kill: number to defeat
  tasks?: string[];
  active: boolean;
  rewards: {
    gold?: number;
    xp?: number;
    items?: { item: Item; count: number }[];
  };
}
