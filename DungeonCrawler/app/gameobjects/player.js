import {get_random_placement_for_game_object_with_room_handle} from '../algo/common';
import {get_starting_weapon} from './weapons';

const get_player = (dungeon, dungeon_level, player) => {
  var result = get_random_placement_for_game_object_with_room_handle(dungeon);

  if (dungeon_level > 1) {
    player.position = result.position;
    player.room = result.room;
    player.connection_cell = null;
    return player;
  } else {
    return {
      position: result.position,
      room: result.room,
      connection_cell: null,
      health: 100,
      experience: 0,
      level: 1,
      weapon: get_starting_weapon()
    }
  }
};

export const get_player_attack = (player) => {
  var player_attack = Math.floor((player.level / 3) * player.weapon.attack);
  return player_attack;
};

export default get_player;
