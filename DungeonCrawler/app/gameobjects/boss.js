import {get_random_position_for_game_object, object_position_already_taken} from '../algo/common';
import {random} from '../algo/common';

export default (dungeon, already_present_game_objects) => {
  while (true) {
    var boss_position = get_random_position_for_game_object(dungeon);
    if (!object_position_already_taken(boss_position, already_present_game_objects)) {
      return {
        position: boss_position,
        health: 5000,
        attack: 350
      }
    }
  }
};

export const get_boss_attack = (boss) => {
  var boss_attack = boss.attack;
  var upper = Math.floor(0.9 * boss_attack);
  var lower = Math.floor(1.0 * boss_attack);
  return random(upper, lower);
};
