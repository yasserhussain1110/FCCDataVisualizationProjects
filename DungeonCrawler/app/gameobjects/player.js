import {get_random_position_for_game_object} from '../algo/common';
import {get_starting_weapon} from './weapons';

const get_player = (dungeon, dungeon_level, player) => {
  var player_position = get_random_position_for_game_object(dungeon);
  if (dungeon_level > 1) {
    player.position = player_position;
    return player;
  } else {
    return {
      position : player_position,
      health : 100,
      experience: 0,
      level : 1,
      weapon : get_starting_weapon()
    }
  }
};

export default get_player;
