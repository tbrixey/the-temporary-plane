# Skilling

Skilling will be a major part of the game. Part of the grind if you will. Here is a table for skilling items and levels you need for each item. Skilling will also be required for some quests.

## Skills

- Mining
  - Standard mining skill. Will probably implement a smithing tree later on, but for now smithing is with mining
- Woodcutting
  - Cutting trees. You need wood for things and this is how you can get it.
- Arcana
  - This will be mainly potion and scroll crafting.
- Cooking
  - Cooking things to buff stats or heal yourself.
- Gathering
  - What you can gather for things like cooking,arcana. Some of these items will have instant uses as well

### Skill Breakdowns

| Skill       | Level | Item               | Location |
| ----------- | ----- | ------------------ | -------- |
| Mining      | 0     | Clay               | Drandor  |
| Woodcutting | 0     | Twig               | Thalo    |
| Arcana      | 0     | Weak Health Potion | Any      |
| Cooking     | 0     | Questionable Stew  | Any      |
| Gathering   | 0     | Red Berries        | Glegas   |

#### GET

`/api/skilling`

| Parameter | Type    |
| --------- | ------- |
| skill     | String  |
| level     | Boolean |
| location  | String  |

Returns a list of things to be skilled. This can be filtered by skill, level, location.

#### POST

`/api/skilling/<skill>`

Start working on your skill of choice. You must be at the proper location to work on said skill. This will take time and lock your character from certain actions.
