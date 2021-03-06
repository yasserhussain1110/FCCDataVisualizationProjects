import {get_random_position_for_game_object, object_position_already_taken} from '../algo/common';
import {random} from '../algo/common';

const get_enemies = (dungeon, dungeon_level, already_present_game_objects, number_of_enemies) => {
  var enemies = [];
  for (var i = 0; i < number_of_enemies; i++) {
    while (true) {
      var enemy_position = get_random_position_for_game_object(dungeon);
      if (!object_position_already_taken(enemy_position, already_present_game_objects)) {
        enemies.push(make_enemy_with_position_according_to_level(enemy_position, dungeon_level));
        break;
      }
    }
  }
  return enemies;
};

const make_enemy_with_position_according_to_level = (enemy_position, dungeon_level) => ({
  position: enemy_position,
  level: dungeon_level,
  health: get_health_from_dungeon_level(dungeon_level),
  attack: get_attack_from_dungeon_level(dungeon_level)
});

const get_health_from_dungeon_level = (dungeon_level) => (
  enemy_level_to_health_attack_map[dungeon_level - 1].health
);

const get_attack_from_dungeon_level = (dungeon_level) => (
  enemy_level_to_health_attack_map[dungeon_level - 1].attack
);

const enemy_level_to_health_attack_map = [{
  health: 60,
  attack: 20
}, {
  health: 600,
  attack: 50
}, {
  health: 1000,
  attack: 80
}, {
  health: 2400,
  attack: 125
}];

export const get_enemy_attack = (enemy) => {
  var enemy_attack = enemy.attack;
  var upper = Math.floor(0.9 * enemy_attack);
  var lower = Math.floor(1.0 * enemy_attack);
  return random(upper, lower);
};

export default get_enemies;
