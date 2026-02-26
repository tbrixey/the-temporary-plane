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
    "message": "Player created! Pick a class using /api/class/<classname>",
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

**Description:** Retrieves a list of all cities in the game world.

**Query Parameters:**
- `name` (optional, string): Filter by city name (case-insensitive regex)
- `population` (optional, number): Filter by population
- `type` (optional, string): Filter by type (defaults to "city")

**Response (Success - 200):**
```json
{
  "data": [
    {
      "_id": "cityId",
      "name": "City Name",
      "population": 1000,
      "type": "city"
    }
  ]
}
```

---

### 6. Get Classes
**Endpoint:** `GET /gameapi/class`

**Description:** Retrieves information about all available character classes.

**Response (Success - 200):**
```json
{
  "data": [
    {
      "name": "Fighter",
      "str": 1,
      "con": 1,
      "speed": 0,
      "weight": 0
    },
    {
      "name": "Rogue",
      "dex": 2,
      "speed": 0,
      "weight": 0
    }
  ]
}
```

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
      "str": 0,
      "con": 0,
      "dex": 0,
      "int": 0,
      "luck": 0
    }
  ]
}
```

---

## Authenticated Routes

### 8. Register Class
**Endpoint:** `POST /gameapi/class/:className`

**Description:** Assigns a class to the player and applies stat bonuses.

**Path Parameter:**
- `className` (string): Name of the class to register

**Stat Bonuses by Class:**
- **Fighter:** +1 STR, +1 CON
- **Rogue:** +2 DEX
- **Mage:** +2 INT
- **Cleric:** +1 INT, +1 LUCK
- **Ranger:** +1 DEX, +1 CON

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
  "message": "Race selected! Pick a starting city /api/city/<racename>"
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
    "class": "Fighter",
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
- **Consumable:** Can be used for healing or stat effects
  - **Hitpoints:** Restores HP (capped at max)
  - **Stats:** Temporary stat boost
  - **Speed:** Temporary speed boost
  - **Weight:** Temporary weight reduction
- **Junk:** Cannot be used

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
  "message": "Location not found. Check for locations using '/api/locations'"
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
  "message": "Location not found. Check for locations using '/api/locations'"
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

**Description:** Retrieves available quests.

**Query Parameters:**
- `type` (optional, string): Filter by quest type (`fetch` or `explore`)

**Response (Success - 200):**
```json
[
  {
    "_id": "questId",
    "name": "Quest Name",
    "description": "Quest description",
    "type": "fetch",
    "active": true,
    "acquire": { itemObject },
    "rewards": { itemsArray }
  }
]
```

**Note:** Quests with type `intro` are excluded by default.

---

### 17. Accept Quest
**Endpoint:** `POST /gameapi/quests/:questId`

**Description:** Accepts a quest and adds it to the player's quest list.

**Path Parameter:**
- `questId` (integer): ID of the quest to accept

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
- `questId` (integer): ID of the quest to drop

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
- `skill` (optional, string): Filter by skill name
- `level` (optional, number): Filter by minimum level
- `location` (optional, string): Filter by location

**Response (Success - 200):**
```json
{
  "data": [
    {
      "_id": "skillId",
      "skill": "mining",
      "location": "cityName",
      "level": 1,
      "time": 30,
      "item": "ore"
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

**Description:** Starts a skilling activity (e.g., mining, woodcutting).

**Request Body:**
```json
{
  "skillName": "mining",
  "item": "ore",
  "count": 1
}
```

**Response (Success - 200):**
```json
{
  "message": "Started working on mining getting ore"
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
  name: string;
  description: string;
  type: 'fetch' | 'explore' | 'intro';
  active: boolean;
  acquire?: ItemObject;
  rewards?: {
    items: ItemObject[];
    xp?: number;
  };
}
```

---

## Item Data Structure

```typescript
{
  _id: string;
  name: string;
  type: 'consumable' | 'junk' | 'equipment';
  effect?: {
    hitpoints?: number;
    stats?: { [key: string]: number };
    speed?: number;
    weight?: number;
    time?: number; // minutes
  };
}
```

---

## Location Data Structure

```typescript
{
  _id: string;
  name: string;
  x: number;
  y: number;
  population: number;
  type: string;
}
```

---

## Skill Data Structure

```typescript
{
  _id: string;
  skill: string;
  location: string;
  level: number;
  time: number; // seconds
  item: string;
}
```