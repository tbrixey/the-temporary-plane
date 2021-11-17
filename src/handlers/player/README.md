# Player

This will get you started as well as some basic character endpoints you can hit.

#### GET

`/api/player/:playerName`

example when you are requesting another player.

```json
{
  "playerName": "Player Name",
  "race": "Human",
  "class": "Fighter",
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
  "location": "Drandor",
  "traveling": "",
  "arrivalTime": ""
  "bag": [{ "id": 1, "count": 2 }]
}
```
