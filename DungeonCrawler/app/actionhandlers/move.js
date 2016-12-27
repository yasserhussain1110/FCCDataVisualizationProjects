import {get_rooms_having_connection_cell, position_in_which_of_two_rooms,
  is_position_one_of_connection_cells, is_position_in_room} from '../algo/movement_helper';

import {is_collision, take_action_based_on_collision_type} from '../algo/collision_helper';

const move = (key, gameState) => {
  var tentative_position = get_tentative_position(key, gameState.player.position);
  var collision_result;

  if (collision_result = is_collision(tentative_position, gameState.enemies,
                                          gameState.weapons, gameState.healths, gameState.transporter, gameState.boss)) {

    return take_action_based_on_collision_type(collision_result, gameState);


  } else {
    var new_player_object =
      try_to_move(tentative_position, gameState.player, gameState.dungeon.rooms, gameState.dungeon.connection_cells);

    return {
      player: new_player_object
    };
  }
};

const try_to_move = (tentative_position, player, rooms, connection_cells) => {
  if (player.connection_cell) {
    var rooms_having_connection_cell = get_rooms_having_connection_cell(rooms, player.connection_cell);
    var room = position_in_which_of_two_rooms(tentative_position, rooms_having_connection_cell[0], rooms_having_connection_cell[1]);

    if (!room) {
      // Nothing Changed
      return player;
    }

    player.connection_cell = null;
    player.room = room;
    player.position = tentative_position;
    return player;

  } else if(player.room) {
    if (is_position_one_of_connection_cells(tentative_position, connection_cells)) {
      player.connection_cell = tentative_position;
      player.position = tentative_position;
      player.room = null;
      return player;
    } else if (is_position_in_room(tentative_position, player.room)) {
      player.position = tentative_position;
      return player;
    } else {
      // No change. Not a valid move.
      return player;
    }
  }
};

const get_tentative_position = (actionKey, player_position) => {
  var row = player_position.row;
  var col = player_position.col;

  switch (actionKey) {
    case "ArrowLeft":
      col--;
      break;
    case "ArrowRight":
      col++;
      break;
    case "ArrowUp":
      row--;
      break;
    case "ArrowDown":
      row++;
      break;
    default:
      console.log("what the hell!!");
  }

  return {row, col};
};

export default move;
