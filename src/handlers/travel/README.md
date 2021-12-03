# Traveling

This handles all things travel. Traveling to any location in the world is handled here. You can't stop traveling once you start going somewhere.

#### GET

Returns the estimated arrival time for destiation.

`/api/travel/<destinationName>`

```json
{
  "arrivalTime": "2 Minutes"
}
```

#### POST

This starts traveling to destination.

`api/travel/<destinationName>`
