export interface Item {
  _id: any;
  id: number;
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
}
