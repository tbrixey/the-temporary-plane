export interface Quest {
  id: number;
  title: string;
  description: string;
  type: "intro" | "fetch" | "explore" | "fight";
  acquire?: number;
  location?: string;
  tasks?: string[];
  active: boolean;
  rewards: {
    gold: number;
    xp: number;
    items?: {
      id: number;
      count: number;
      name?: string;
    }[];
  };
}
