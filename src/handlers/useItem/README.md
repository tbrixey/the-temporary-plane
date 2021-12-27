# Use Items

Here we handle players using a consumable or equipping equipment.

#### POST

Checks that the player has at least 1 of those items in their bag then uses that item.

`/api/item/use/<itemId>`

```json
{
  "message": "string"
}
```

Right now there is a limit of 1 bonus stat item at a time. Maybe later I will allow stacking of stat boosting items. Anything that alters a player stat is a stat bonus item. Equipment is separate to items. For example to get 3 bonus Intelligence, Equip Mage Robes and drink an Intelligence Potion.
