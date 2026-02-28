# The Temporary Plane - API Documentation

## Base URL
`/gameapi`

## Overview
This is a RESTful API for a text-based RPG game called "The Temporary Plane". The API handles player registration, character creation, quest management, travel, and skilling activities.

---

## Authentication

### API Key
All authenticated routes require an API key in the request header:
```
Authorization: Bearer <your-api-key>
```

---

## Public Routes (No Authentication Required)

### 1. Health Check
**Endpoint:** `GET /gameapi`

**Description:** Returns a simple health check message.

**Response:**
```json
{
  "message": "The Temporary Plane is online"
}
```

**Status Code:** 200

---

### 2. Register Player
**Endpoint:** `POST /gameapi/register/:playerName`

**Description:** Creates a new player account with a generated API key.

**Path Parameter:**
- `playerName` (string, max 36 chars): The unique name for the player

**Response (Success - 201):**
```json
{
  "data": {
    "playerName": "playerName",
    "apiKey": "generated-api-key",
    "message": "Player created! Pick a class using /gameapi/class/<classname>",
    "quests": { questObject }
  }
}
```

**Response (Error - 400):**
```json
{
  "message": "Player name is too long!"
}
```

**Response (Error - 409):**
```json
{
  "message": "Player already exists!"
}
```

**Note:** In test environment, `unit-test-user-new` is reserved.

---

### 3. Authorize Player
**Endpoint:** `POST /gameapi/authorizePlayer`

**Description:** Retrieves complete player data including bag, quests, and location.

**Request Body:**
```json
{
  "apiKey": "your-api-key"
}
```

**Response (Success - 200):**
```json
{
  "data": {
    // Complete player object with:
    // - playerName
    // - apiKey
    // - level, maxHitpoints, hitpoints
    // - gold, bag, skills
    // - quests (array of quest IDs)
    // - location
    // - class, race
    // - stats, speed, weight
  }
}
```

**Note:** This endpoint is used to get the full player state.

---

### 4. Get All Players
**Endpoint:** `GET /gameapi/players`

**Description:** Retrieves a list of all players who have started the game.

**Response (Success - 200):**
```json
{
  "data": [
    {
      "playerName": "playerName",
      "location": { locationObject }
    }
  ]
}
```

**Note:** Requires `startingLocation` field to exist.

---

### 5. Get Cities
**Endpoint:** `GET /gameapi/cities`

**Description:** Retrieves a list of locations in the game world, with optional filters.

**Query Parameters:**
- `name` (optional, string): Filter by location name (case-insensitive regex)
- `population` (optional, number): Filter by population
- `type` (optional, string): Filter by type (e.g. `city`, `town`, `village`, `outpost`, `poi`)

**Response (Success - 200):**
```json
{
  "data": [
    {
      "_id": "locationId",
      "name": "Solstice",
      "type": "city",
      "x": 0,
      "y": 0,
      "population": 125400
    },
    {
      "_id": "locationId",
      "name": "Oakhaven",
      "type": "town",
      "x": -35,
      "y": 20,
      "population": 1204
    }
  ]
}
```

**Note:** Seed data includes types: `city`, `town`, `village`, `outpost`.

---

### 5b. Get Locations
**Endpoint:** `GET /gameapi/locations`

**Description:** Retrieves all locations in the game world (no query filters).

**Response (Success - 200):**
```json
[
  {
    "_id": "locationId",
    "name": "Udame",
    "type": "town",
    "x": 80,
    "y": 10,
    "population": 524
  }
]
```

**Note:** Response is a raw array, not wrapped in `data`. Use this when you need the full list for travel or discovery.

---

### 6. Get Classes
**Endpoint:** `GET /gameapi/class`

**Description:** Retrieves information about all available character classes.

**Response (Success - 200):**
```json
{
  "data": [
    {
      "name": "Warrior",
      "description": "The bread and butter of any party...",
      "weight": 200,
      "speed": 50,
      "bonus": "Can wear heavy armor without complaining."
    },
    {
      "name": "Rogue",
      "description": "A professional shadow-stayer...",
      "weight": 100,
      "speed": 90,
      "bonus": "Higher chance to 'find' things..."
    },
    {
      "name": "Wizard",
      "description": "A glass cannon made of old paper...",
      "weight": 80,
      "speed": 75,
      "bonus": "Occasionally remembers where they put their spellbook."
    },
    {
      "name": "Paladin",
      "description": "A warrior with a moral compass...",
      "weight": 260,
      "speed": 30,
      "bonus": "Naturally glows in the dark..."
    },
    {
      "name": "Ranger",
      "description": "Likes trees more than people...",
      "weight": 150,
      "speed": 65,
      "bonus": "Can talk to squirrels..."
    }
  ]
}
```

**Available classes:** Warrior, Rogue, Wizard, Paladin, Ranger

---

### 7. Get Races
**Endpoint:** `GET /gameapi/race`

**Description:** Retrieves information about all available character races.

**Response (Success - 200):**
```json
{
  "data": [
    {
      "_id": "raceId",
      "name": "Human",
      "description": "Just a normal human. Remarkably average at everything..."
    },
    {
      "_id": "raceId",
      "name": "Elf",
      "description": "Pointy-eared vegetarians who live way too long..."
    }
  ]
}
```

**Available races:** Human, Elf, Dwarf, Halfling, Orc, Gnome

---

## Authenticated Routes

### 8. Register Class
**Endpoint:** `POST /gameapi/class/:className`

**Description:** Assigns a class to the player. The class's `weight` and `speed` are applied to the player.

**Path Parameter:**
- `className` (string): Name of the class to register. Must be one of: **Warrior**, **Rogue**, **Wizard**, **Paladin**, **Ranger**

**Response (Success - 200):**
```json
{
  "data": { playerObject },
  "message": "Class selected! Pick a race using /api/race/<racename>"
}
```

**Response (Error - 400):**
```json
{
  "message": "Class not found"
}
```

**Response (Error - 400):**
```json
{
  "message": "Player already has a class"
}
```

---

### 9. Register Race
**Endpoint:** `POST /gameapi/race/:raceName`

**Description:** Assigns a race to the player.

**Path Parameter:**
- `raceName` (string): Name of the race to register

**Response (Success - 200):**
```json
{
  "data": { playerObject },
  "message": "Race selected! Pick a starting city /api/city/<cityId>"
}
```

**Response (Error - 400):**
```json
{
  "message": "Player already has a race"
}
```

---

### 10. Register Starting City
**Endpoint:** `POST /gameapi/city/:cityId`

**Description:** Sets the player's starting location and current location.

**Path Parameter:**
- `cityId` (string): MongoDB ObjectId of the starting city

**Response (Success - 200):**
```json
{
  "data": { playerObject },
  "message": "Starting city selected! The world is now yours!..."
}
```

**Response (Error - 400):**
```json
{
  "message": "City does not exist"
}
```

**Response (Error - 400):**
```json
{
  "message": "Player already has a starting location"
}
```

---

### 11. Get Player
**Endpoint:** `GET /gameapi/player/:playerName`

**Description:** Retrieves player information by name.

**Path Parameter:**
- `playerName` (string): Name of the player

**Response (Success - 200):**
```json
{
  "data": {
    "playerName": "playerName",
    "class": "Warrior",
    // ... other player data
  }
}
```

**Response (Error - 404):**
```json
{
  "message": "Player not found"
}
```

---

### 12. Level Player
**Endpoint:** `POST /gameapi/player/level/:toLevel`

**Description:** Increases a specific stat by spending level points.

**Path Parameter:**
- `toLevel` (string): Stat to increase. Valid values: `str`, `con`, `int`, `dex`, `luck`, `speed`, `weight`

**Request Body:**
```json
{
  "levelPointsToUse": 1
}
```

**Stat Changes:**
- **STR:** +1 Strength
- **CON:** +1 Constitution
- **INT:** +1 Intelligence
- **DEX:** +1 Dexterity
- **LUCK:** +1 Luck
- **SPEED:** +2 Speed
- **WEIGHT:** +3 Weight

**HP Calculation:** New HP = 5 + Current CON

**Response (Success - 200):**
```json
{
  "message": "You leveled up!",
  "user": { playerObject }
}
```

**Response (Error - 400):**
```json
{
  "message": "You don't have any level points to use."
}
```

**Response (Error - 400):**
```json
{
  "message": "Invalid stat to level: invalidStat"
}
```

---

### 13. Use Item
**Endpoint:** `POST /gameapi/item/use/:itemId`

**Description:** Uses an item from the player's bag.

**Path Parameter:**
- `itemId` (string): MongoDB ObjectId of the item to use

**Item Types:**
- **Consumable:** Can be used for healing or skill/stat effects
  - **Hitpoints:** Restores HP (e.g. Minor Health Potion)
  - **Skill boost:** Temporary skill bonus (e.g. Miner's Mud: +5 mining for 10 min)
  - **Speed:** Temporary speed boost (e.g. Zoom Juice)
  - **Weight:** Temporary weight reduction (e.g. Mule's Milk)

**Response (Success - 200):**
```json
{
  "message": "You used [Item Name]"
}
```

**Response (Error - 400):**
```json
{
  "message": "You are already at max health"
}
```

**Response (Error - 400):**
```json
{
  "message": "You searched everywhere, but can not find this item."
}
```

---

### 14. Get Travel Info
**Endpoint:** `GET /gameapi/travel/:destination`

**Description:** Calculates travel time to a destination.

**Path Parameter:**
- `destination` (string): Name of the destination location

**Response (Success - 200):**
```json
{
  "message": "It will take approximately 1234 seconds to get to [destination]"
}
```

**Response (Error - 400):**
```json
{
  "message": "Currently at destination"
}
```

**Response (Error - 404):**
```json
{
  "message": "Location not found. Check for locations using '/gameapi/locations'"
}
```

**Response (Error - 404):**
```json
{
  "message": "Users location not found. Please reach out to support..."
}
```

**Travel Time Formula:**
```
travelTime = (distance / 2) / speed
```

---

### 15. Travel To
**Endpoint:** `POST /gameapi/travel/:destination`

**Description:** Initiates travel to a destination location.

**Path Parameter:**
- `destination` (string): Name of the destination location

**Response (Success - 200):**
```json
{
  "message": "It will take 1234 seconds to get to [destination]",
  "time": "1234"
}
```

**Response (Error - 400):**
```json
{
  "message": "Currently at destination"
}
```

**Response (Error - 404):**
```json
{
  "message": "Location not found. Check for locations using '/gameapi/locations'"
}
```

**Response (Error - 404):**
```json
{
  "message": "Users location not found. Please reach out to support..."
}
```

**Travel Process:**
1. Calculates travel time with random deviation (±2-25%)
2. Updates player's `arrivalTime` field
3. Creates a record in the `traveling` collection
4. Player must wait until `arrivalTime` before moving again

---

### 16. Get Quests
**Endpoint:** `GET /gameapi/quests`

**Description:** Retrieves available quests. Requires player to be in a city.

**Query Parameters:**
- `type` (optional, string): Filter by quest type (`fetch` or `explore`). When omitted, all non-intro quests are returned.

**Response (Success - 200):**
```json
[
  {
    "_id": "questId",
    "title": "The Heavy Lifting",
    "description": "Fetch some Rusty Iron Ore from the Solstice Mine and bring it to the Forge.",
    "type": "fetch",
    "active": true,
    "goto": "Solstice Mine",
    "acquire": { itemObject },
    "location": "Solstice Forge",
    "rewards": { "gold": 50, "xp": 100, "items": [{ "item": { itemObject }, "count": 1 }] }
  },
  {
    "_id": "questId",
    "title": "The Scenic Route",
    "description": "Visit The High Spire.",
    "type": "explore",
    "location": "The High Spire",
    "rewards": { "gold": 20, "xp": 50 }
  },
  {
    "_id": "questId",
    "title": "Pigeon Patrol",
    "description": "The local statues are suffering. Thin out the pigeon population at the Plaza.",
    "type": "kill",
    "target": "Aggressive Pigeon",
    "count": 5,
    "location": "Solstice Plaza",
    "rewards": { "gold": 40, "xp": 120 }
  }
]
```

**Quest types:** `intro`, `fetch`, `explore`, `kill`. Quests with type `intro` are excluded by default. `rewards` may include `gold`, `xp`, and `items` (array of `{ item, count }`). Fetch quests have `goto`, `acquire`, `location`; explore quests have `location`; kill quests have `target`, `count`, `location`.

---

### 17. Accept Quest
**Endpoint:** `POST /gameapi/quests/:questId`

**Description:** Accepts a quest and adds it to the player's quest list. Requires player to be in a city.

**Path Parameter:**
- `questId` (string): MongoDB ObjectId of the quest to accept

**Response (Success - 200):**
```json
"Quest accepted!"
```

**Response (Error - 400):**
```json
{
  "message": "Quest already accepted"
}
```

**Response (Error - 400):**
```json
{
  "message": "Quest does not exist"
}
```

---

### 18. Drop Quest
**Endpoint:** `DELETE /gameapi/quests/:questId`

**Description:** Abandons a quest and removes it from the player's quest list.

**Path Parameter:**
- `questId` (string): MongoDB ObjectId of the quest to drop

**Response (Success - 200):**
```json
"Quest abandoned!"
```

**Response (Error - 400):**
```json
{
  "message": "Quest not found."
}
```

---

### 19. Get Skilling Info
**Endpoint:** `GET /gameapi/skilling`

**Description:** Retrieves available skilling activities.

**Query Parameters:**
- `skill` (optional, string): Filter by skill name (e.g. `mining`, `woodcutting`, `fishing`, `thievery`, `cooking`, `alchemy`, `agility`, `farming`, `smithing`, `slaying`)
- `level` (optional, number): Filter by minimum level (skills where `level <=` this value)
- `location` (optional, string): Filter by location name

**Response (Success - 200):**
```json
{
  "data": [
    {
      "_id": "skillId",
      "skill": "mining",
      "level": 0,
      "itemId": 2,
      "itemName": "Rusty Iron Ore",
      "location": "Solstice",
      "craftable": false,
      "time": 45,
      "description": "Violently liberating rocks from their homes in the ground."
    },
    {
      "_id": "skillId",
      "skill": "woodcutting",
      "level": 0,
      "itemId": 1,
      "itemName": "Pine Wood",
      "location": "Solstice",
      "craftable": false,
      "time": 60,
      "description": "The art of hitting a tree until it falls over..."
    }
  ]
}
```

**Response (Success - 200):**
```json
{
  "message": "There are no skills matching your criteria."
}
```

---

### 20. Start Skilling
**Endpoint:** `POST /gameapi/skilling`

**Description:** Starts a skilling activity (e.g., mining, woodcutting). The activity must be available at the player's current location; `item` is matched against the skill's `itemName` (case-insensitive).

**Request Body:**
```json
{
  "skillName": "mining",
  "item": "Rusty Iron Ore",
  "count": 1
}
```

- `skillName` (string): Skill name (e.g. `mining`, `woodcutting`, `fishing`)
- `item` (string): Item name produced by the skill (e.g. `Rusty Iron Ore`, `Pine Wood`, `Confused Guppy`). Must match a skill at the player's location.
- `count` (optional, number): Default 1. Total time = skill `time` × count (in seconds).

**Response (Success - 200):**
```json
{
  "message": "Started working on mining getting Rusty Iron Ore"
}
```

**Response (Error - 400):**
```json
{
  "message": "invalid request. Missing either skillName or item in the body."
}
```

**Response (Success - 200):**
```json
{
  "message": "Unable to work on [skill] here."
}
```

**Skilling Process:**
1. Validates skill, item, and location
2. Calculates finish time based on skill time × count
3. Updates player's `finishTime` field
4. Creates a record in the `skilling` collection
5. Player must wait until `finishTime` before starting another activity

---

## Middleware

### API Key Check
**Middleware:** `checkApiKey`
- Validates API key in request header
- Applies to all routes after line 58 in app.ts

### Character Creation Complete
**Middleware:** `characterCreationComplete`
- Ensures player has completed character creation
- Checks for: class, race, startingLocation

### Check Player Travel
**Middleware:** `checkPlayerTravel`
- Prevents travel if player is currently traveling
- Checks `arrivalTime` field

### Check Quest Complete
**Middleware:** `checkQuestComplete`
- Checks if all active quests are completed
- Sets `X-Quests-Complete` header

### Check Player Skilling Status
**Middleware:** `checkPlayerSkillingStatus`
- Prevents starting new skilling if player has active skilling
- Checks `finishTime` field

### Is Player In City
**Middleware:** `isPlayerInCity`
- Ensures player is in a city before certain actions
- Used for quest-related operations

---

## Rate Limiting

**Middleware:** `rateLimiter`
- Window: 1 minute
- Max requests: 100
- Applies to all routes under `/gameapi`

---

## Error Responses

All endpoints may return these standard error responses:

```json
{
  "message": "Error description"
}
```

Common status codes:
- **200:** Success
- **400:** Bad Request (invalid parameters)
- **404:** Not Found (resource doesn't exist)
- **409:** Conflict (resource already exists)
- **500:** Internal Server Error

---

## Player Data Structure

### User Object
```typescript
{
  _id: string;
  apiKey: string;
  playerName: string;
  level: number;
  levelPointsToUse: number;
  maxHitpoints: number;
  hitpoints: number;
  xpToNextLevel: number;
  gold: number;
  bag: Array<{
    item: ItemObject;
    count: number;
  }>;
  skills: {
    mining: number;
    woodcutting: number;
    arcana: number;
    cooking: number;
    gathering: number;
  };
  quests: string[]; // Array of quest IDs
  class?: string;
  race?: string;
  startingLocation?: ObjectId;
  location?: ObjectId;
  stats: {
    str: number;
    con: number;
    dex: number;
    int: number;
    luck: number;
  };
  speed: number;
  weight: number;
  bonusStats?: {
    stats: { [key: string]: number };
    time: Date;
  };
  arrivalTime?: Date;
  finishTime?: Date;
  updatedOn?: Date;
}
```

---

## Quest Data Structure

```typescript
{
  _id: string;
  title: string;
  description: string;
  type: 'intro' | 'fetch' | 'explore' | 'kill';
  active: boolean;
  goto?: string;           // fetch: where to get the item
  acquire?: ItemObject;     // fetch: item to acquire
  location?: string;       // fetch/explore/kill: quest location
  target?: string;         // kill: monster name
  count?: number;          // kill: number to defeat
  rewards?: {
    gold?: number;
    xp?: number;
    items?: { item: ItemObject; count: number }[];
  };
}
```

---

## Item Data Structure

```typescript
{
  _id: string;
  name: string;
  description?: string;
  type: 'consumable' | 'junk' | 'equipment';
  value?: number;
  weight?: number;
  effect?: {
    hitpoints?: number;
    stats?: { [key: string]: number };
    speed?: number;
    weight?: number;
    time?: number;         // minutes
    // Skill boost (consumables): e.g. mining, woodcutting, fishing, cooking, etc.
    [skillName: string]?: number;
  };
}
```

---

## Location Data Structure

```typescript
{
  _id: string;
  name: string;
  type: 'city' | 'town' | 'village' | 'outpost' | 'poi';
  x: number;
  y: number;
  population: number;
}
```

---

## Skill Data Structure

```typescript
{
  _id: string;
  skill: string;
  level: number;
  itemId: number;
  itemName: string;
  location: string;
  craftable: boolean;
  time: number;           // seconds per unit
  description?: string;
}
```

---

## Monster Data Structure (seed / game data)

Used by **kill**-type quests (`target` field). Not exposed by a dedicated API endpoint.

```typescript
{
  _id: string;
  name: string;
  description: string;
  hp: number;
  level: number;
  location: string;
  drops?: { item: string; chance: number }[];
}
```

**Seed examples:** Aggressive Pigeon (Solstice Plaza), Sentient Dust Bunny (Shady Alley), Buff Rat (Solstice Sewers).