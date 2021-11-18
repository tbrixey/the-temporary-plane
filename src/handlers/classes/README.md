# Classes

The classes are inspired from D&D and other RPGs I've played. They contain most of your player stats because I didn't want to min/max race.

#### GET

example get response

```json
{
  "name": "Fighter",
  "weight": 100,
  "description": "lorem ipsum",
  "speed": 25
}
```

#### POST

`/api/class/<className>`

Sets your player's class. This can only be set once for now.
