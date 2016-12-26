import {get_random_position_for_game_object, object_position_already_taken} from '../algo/common';

export default (dungeon, already_present_game_objects) => {
  while (true) {
    var boss_position = get_random_position_for_game_object(dungeon);
    if (!object_position_already_taken(boss_position, already_present_game_objects)) {
      return {
        position: boss_position,
        health: 6000,
        attack: 400
      }
    }
  }
};
