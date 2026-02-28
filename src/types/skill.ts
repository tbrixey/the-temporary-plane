export interface Skill {
  _id: string;
  skill: string;
  level: number;
  itemId: number;
  itemName: string;
  location: string;
  craftable: boolean;
  time: number;
  description?: string;
}
