export const get_rooms_having_connection_cell = (rooms, connection_cell) => {
  var rooms_having_connection_cell = [];
  for (var i = 0; i < rooms.length; i++) {
    var room = rooms[i];
    if (does_any_connection_cell_of_room_match_given_connection_cell(room.connection_cells, connection_cell)) {
      rooms_having_connection_cell.push(room);
      if (rooms_having_connection_cell.length === 2) {
        return rooms_having_connection_cell;
      }
    }
  }
};

const does_any_connection_cell_of_room_match_given_connection_cell = (room_connection_cells, connection_cell) => {
  for (var i=0; i<room_connection_cells.length; i++) {
    var room_connection_cell = room_connection_cells[i];
    if (room_connection_cell.row === connection_cell.row && room_connection_cell.col === connection_cell.col) {
      return true;
    }
  }
  return false;
};

export const position_in_which_of_two_rooms = (position, room1, room2) => {
  if (is_position_in_room(position, room1)) {
    return room1;
  } else if (is_position_in_room(position, room2)) {
    return room2;
  } else {
    return null;
  }
};

export const is_position_in_room = (position, room) => {
  return (position.row >= room.origin.row && position.row <= room.origin.row + room.height - 1)
    &&
  (position.col >= room.origin.col && position.col <= room.origin.col + room.width - 1);
};

export const is_position_one_of_connection_cells = (position, connection_cells) => {
  for (var i = 0; i < connection_cells.length; i++) {
    var connection_cell = connection_cells[i];
    if (connection_cell.row === position.row && connection_cell.col === position.col) {
      return true;
    }
  }
  return false;
};

