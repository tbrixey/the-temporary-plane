import { Item } from './items';

export interface Quest {
  _id: string;
  title: string;
  description: string;
  type: 'intro' | 'fetch' | 'explore' | 'fight';
  goto?: string;
  acquire?: Item;
  location?: string;
  tasks?: string[];
  active: boolean;
  rewards: {
    gold: number;
    xp: number;
    items?: { item: Item; count: number }[];
  };
}
