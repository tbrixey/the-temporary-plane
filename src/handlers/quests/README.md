# Quests

You have to have questing in any good RPG. This is where we handle most things questing. Getting, finding, dropping. You can't do anything with quests while you are in transit. The only place you can check quests is inside a city.

#### GET

Returns all available quests to pickup. This list will change when I feel like it, but probably will schedule something once a week/month?

`/api/quest?type=[fetch|explore]`

```json
{
  "data": [
    {
      "id": 2,
      "title": "Explore the Spacious Den.",
      "description": "Check out the Spacious Den and see if anyone or anything is there. Please report to the Nuibus Chancellor with your findings.",
      "type": "fetch",
      "acquire": "Fairy Dust",
      "location": "Nuibus",
      "rewards": {
        "gold": 1,
        "xp": 50
      }
    }
  ]
}
```

#### POST

This picks up a quest to start tracking.

`api/quest/<questId>`
