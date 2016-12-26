componentDidMount -
  get_dungeon()
  place_player()
  place_enemies()
  if lastLevel:
    place_boss()
  place_weapons()
  place_health()
  if not lastLevel:
    place_transporter()


GameState:
  dungeon,
  dungeonLevel,
  player,
  enemies,
  weapons,
  healths,
  transporter,
  boss



GameObjects -

  player,       // blue
  enemy,        // red
  weapon,       // yellow
  health,       // green
  transporter,  // purple
  boss          // big red


player -
{
  position : { row : 0, col : 0},
  health : 0,
  experience: 0,
  level : 0,
  weapon
}

enemy -
{
  position: { row : 0, col : 0},
  level: 0,
  health: 0,
  attack: 0
}

weapon -
{
  position: { row : 0, col : 0},
  name: "",
  attack: 0
}


health -
{
  position: { row : 0, col : 0},
  amount: 0
}

transporter -
{
  position: { row : 0, col : 0}
}

boss -
{
  position: { row : 0, col : 0}
  Health - 6000
  Attack - 400
}

Player -
  Exp -
    Each Hit - 1
    Win      - 10
  Levels -
    Exp -  0   Level - I    (Warrior of Darkness)
    Exp - 40   Level - II   (Scourge of The Damned)
    Exp - 100  Level - III  (Beast of Netherworld)
    Exp - 200  Level - IV   (Knight of Necropolis)
    Exp - 350  Level - V    (Monster Lord of Doom)
    Exp - 600  Level - VI   (Member of Inner Circle of Darkness)

  Attack -
    (int) ( level / 3 ) * weapon attack

Weapons -
  Dungeon Level I -
    Claws and Teeth       - 50
    Poisonous Fangs       - 100
    Cursed Dagger         - 150

  Dungeon Level II -
    Bludgeon Hammer       - 200
    Demonic Cleavers      - 250
    Enchanted Chain Saw   - 300

  Dungeon Level III -
    Sword of Dark Knight  - 350
    Sword of Angel Blood  - 400
    Demon Spirit Sword    - 450

  Dungeon Level IV -
    Lightening of Death   - 500
    Inner Darkness        - 550
    Summoner Staff        - 600


Dungeon Level 1 -
  Enemy Level - 1
  Health - 60
  Attack - 20

Dungeon Level 2 -
  Enemy Level - 2
  Health - 600
  Attack - 50

Dungeon Level 3 -
  Enemy Level - 3
  Health - 1600
  Attack - 100

Dungeon Level 4 -
  Enemy Level - 4
  Health - 3000
  Attack - 200

