import { find } from "lodash";
import { User } from "../types/express";

export const checkQuest = (user: User, questId: number) => {
  const quest = find(user.quests, { id: questId });
  if (!quest) {
    console.warn("Can't find quest on user");
    return user;
  }

  switch (quest.type) {
    case "intro":
      if (quest.id === 1) {
        if (user.class && user.race && user.startingLocation) {
          console.log("QUEST COMPLETE", quest);
        } else {
          return user;
        }
      }
      break;
    case "fetch":
      break;
    case "explore":
      break;
  }
};
