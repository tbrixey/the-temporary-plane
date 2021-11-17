# Cities

Cities are used as hubs as well as starting points when creating a character.

#### GET

`/api/cities`

Get all cities. You can filter results by passing parameters below.

| Parameter  | Type   |
| ---------- | ------ |
| name       | String |
| population | Number |

```json
[
  {
    "name": "Drandor",
    "population": 384,
    "description": "lorem ipsum",
    "traders": [
      {
        "general": {
          "name": "Drandor Goods",
          "money": 1000,
          "items": [
            {
              "id": 1,
              "name": "Health Postion",
              "description": "Heals player by 25",
              "type": "consumable",
              "effect": 25
            }
          ]
        }
      }
    ]
  }
]
```
