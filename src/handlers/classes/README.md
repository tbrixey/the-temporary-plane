# Classes

The classes are inspired from D&D and other RPGs I've played. They contain most of your player stats because I didn't want to min/max race.

#### GET

`/api/class`

```json
[
  {
    "name": "Fighter",
    "weight": 120,
    "description": "A master of martial combat, skilled with a variety of weapons and armor.",
    "speed": 20,
    "bonus": "Strength, Constitution"
  }
]
```

#### POST

`/api/class/<className>`

Sets your player's class. This can only be set once for now.
