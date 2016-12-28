import {get_random_position_for_game_object, object_position_already_taken} from '../algo/common';

export const get_starting_weapon = () => ({
  name: "Bare Hands",
  attack: 40
});

const get_weapons = (dungeon, dungeon_level, already_present_game_objects) => {
  var weapons = [];
  for (var i = 0; i < 3; i++) {
    while (true) {
      var weapon_position = get_random_position_for_game_object(dungeon);
      if (!object_position_already_taken(weapon_position, already_present_game_objects)) {
        weapons.push(make_weapon_with_position_according_to_level_and_index(weapon_position, dungeon_level, i));
        break;
      }
    }
  }
  return weapons;
};

const make_weapon_with_position_according_to_level_and_index = (weapon_position, dungeon_level, weaponIndex) => ({
  position: weapon_position,
  name: weapons[dungeon_level - 1][weaponIndex].name,
  attack: weapons[dungeon_level - 1][weaponIndex].attack,
});

const weapons = [
  [{
    name: "Claws and Teeth",
    attack: 50
  }, {
    name: "Poisonous Fangs",
    attack: 100
  }, {
    name: "Cursed Dagger",
    attack: 150
  }], [{
    name: "Bludgeon Hammer",
    attack: 200
  }, {
    name: "Demonic Cleavers",
    attack: 250
  }, {
    name: "Enchanted Chainsaw",
    attack: 300
  }], [{
    name: "Sword of Dark Knight",
    attack: 450
  }, {
    name: "Sword of Angel Blood",
    attack: 600
  }, {
    name: "Demon Spirit Sword",
    attack: 800
  }], [{
    name: "Lightening of Death",
    attack: 1100
  }, {
    name: "Inner Darkness",
    attack: 1400
  }, {
    name: "Summoner Staff",
    attack: 2000
  }]
];


export default get_weapons;
