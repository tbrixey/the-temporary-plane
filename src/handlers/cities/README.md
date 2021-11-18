# Cities

Cities are used as hubs as well as starting points when creating a character.

#### GET

`/api/cities`

Get all cities. You can filter results by passing parameters below.

| Parameter  | Type   |
| ---------- | ------ |
| name       | String |
| population | Number |
| type       | String |

```json
[
  {
    "name": "Drandor",
    "population": 384,
    "description": "lorem ipsum",
    "type": "city",
    "traders": [
      {
        "name": "Drandor Goods",
        "type": "general",
        "money": 250,
        "items": [
          {
            "id": 1,
            "count": 25
          }
        ]
      },
      {
        "name": "Drandor Goods",
        "type": "weaponsmith",
        "money": 1250,
        "items": [
          {
            "id": 23,
            "count": 25
          }
        ]
      }
    ]
  }
]
```

#### POST

`/api/city/:cityName`

This registers your starting city. Should be done once before doing anything else.
