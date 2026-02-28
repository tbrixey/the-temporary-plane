export interface ItemEffect {
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
  /** Skill boost keys (e.g. woodcutting, mining, fishing, cooking) with numeric value */
  [skillName: string]: number | { str?: number; dex?: number; con?: number; int?: number; luck?: number } | undefined;
}

export interface Item {
  _id: string;
  name: string;
  description?: string;
  effect?: ItemEffect;
  type: 'consumable' | 'junk' | 'equipment';
  value?: number;
  weight?: number;
}
