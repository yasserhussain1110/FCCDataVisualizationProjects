export const random = (lower_limit, upper_limit) => (   // upper limit is inclusive here
  ((Math.random() * (upper_limit - lower_limit + 1)) | 0) + lower_limit
);


export const get_random_room = (dungeon) => {
  const rooms = dungeon.rooms;
  return rooms[random(0, rooms.length - 1)];
};


export const get_random_position_in_room = (room) => {
  var random_col = random(room.origin.col, room.origin.col + room.width - 1);
  var random_row = random(room.origin.row, room.origin.row + room.height - 1);
  return {
    row: random_row,
    col: random_col
  }
};

export const get_random_position_for_game_object = (dungeon) => (get_random_position_in_room(get_random_room(dungeon)));

export const is_position_taken = (position1, position2) => (position1.row === position2.row && position1.col === position2.col);

export const object_position_already_taken = (object_position, other_objects) => {
  for (var i = 0; i < other_objects.length; i++) {
    if (is_position_taken(object_position, other_objects[i].position)) {
      return true;
    }
  }
  return false;
};


export const convert_to_1d_index = (row, col, number_of_cols) => (row * number_of_cols + col);
