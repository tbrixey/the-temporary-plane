# Player

This will get you started as well as some basic character endpoints you can hit.

#### GET

`/api/player/<playerName>`

example when you are requesting another player.

```json
{
  "playerName": "Player Name",
  "race": "Human",
  "class": "Fighter",
  "level": 1,
  "location": "Drandor"
}
```

When requesting your own character.

```json
{
  "playerName": "Player Name",
  "race": "Human",
  "class": "Fighter",
  "coin": 1000,
  "level": 1,
  "xpToNextLevel": 100,
  "location": "Drandor",
  "traveling": "",
  "arrivalTime": "",
  "bag": [{ "id": 1, "count": 2 }],
  "stats": {
    "str": 0,
    "int": 0,
    "dex": 0,
    "con": 0,
    "luck": 0
  },
  "skills": {
    "mining": 0,
    "woodcutting": 0,
    "arcana": 0,
    "cooking": 0,
    "gathering": 0
  }
}
```

`/api/players`

get all players name and locations

```json
[
  {
    "playerName": "Player Name",
    "location": "Drandor"
  }
]
```
