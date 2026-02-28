export interface MonsterDrop {
  item: string;
  chance: number;
}

export interface Monster {
  _id: string;
  name: string;
  description: string;
  hp: number;
  level: number;
  location: string;
  drops?: MonsterDrop[];
}
