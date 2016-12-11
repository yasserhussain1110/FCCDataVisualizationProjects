import do_rooms_overlap_or_touch from './room_overlap';

const select_a_random_room_index = (list_of_rooms) => (random(0, list_of_rooms.length - 1));

const get_random_rooms = (number_of_rooms, max_width, min_width, max_height, min_height) => {
  var rooms = [];
  for (var i = 0; i < number_of_rooms; i++) {
    rooms.push({
      id: i,
      width: random(max_width, min_width),
      height: random(max_height, min_height)
    });
  }
  return rooms;
};

var random = (lower_limit, upper_limit) => (   // upper limit is inclusive here
  ((Math.random() * (upper_limit - lower_limit + 1)) | 0) + lower_limit
);

const position_room_randomly_on_board = (total_number_of_rows, total_number_of_columns, a_room) => {
  var row, col;

  for (var i = 0; i < 10; i++) {   // max 10 trials
    var r_row = random(0, total_number_of_rows - 1);
    var r_col = random(0, total_number_of_columns - 1);
    if (r_row + a_room.height <= total_number_of_rows && r_col + a_room.width <= total_number_of_columns) {
      row = r_row;
      col = r_col;
      break;
    }
  }

  if (row === undefined || col === undefined) {
    throw new Error("Could not place first room on the board", JSON.stringify({
      total_number_of_rows: total_number_of_rows,
      total_number_of_columns: total_number_of_columns,
      a_room: a_room
    }));
  }

  return {row, col};
};

const does_unplaced_room_overlap = (unplaced_room_tentative_origin, unplaced_room, all_placed_rooms) => {

  var tentative_full_unplaced_room_object = {
    origin: unplaced_room_tentative_origin,
    height: unplaced_room.height,
    width: unplaced_room.width
  };

  for (var i = 0; i < all_placed_rooms.length; i++) {

    var result = do_rooms_overlap_or_touch(all_placed_rooms[i], tentative_full_unplaced_room_object);

    if (result) {
      return true;
    }
  }

  return false;
};

const get_placed_room_connection_side = (total_number_of_rows, total_number_of_columns, placed_room) => {
  for (var i = 0; i < 10; i++) {
    var placed_room_connection_side = ["top", "left", "bottom", "right"][random(0, 3)];
    if (placed_room_connection_side === "top") {
      if (placed_room.origin.row > 1) {
        return placed_room_connection_side;
      }
    } else if (placed_room_connection_side === "left") {
      if (placed_room.origin.col > 1) {
        return placed_room_connection_side;
      }
    } else if (placed_room_connection_side === "bottom") {
      if (placed_room.origin.row + placed_room.height - 1 < total_number_of_rows - 2) {
        return placed_room_connection_side;
      }
    } else if (placed_room_connection_side === "right") {
      if (placed_room.origin.col + placed_room.width - 1 < total_number_of_columns - 2) {
        return placed_room_connection_side;
      }
    }
  }

  throw new Error("Could not select side");
};


const try_to_create_connection_at_a_random_place_between_rooms = (total_number_of_rows, total_number_of_columns,
                                                                  placed_room, unplaced_room) => {
  /* select side of connection */
  var placed_room_connection_side =
    get_placed_room_connection_side(total_number_of_rows, total_number_of_columns, placed_room);

  if (placed_room_connection_side === "top") {
    var connection_cell_row = placed_room.origin.row - 1;
    var connection_cell_column = random(placed_room.origin.col, placed_room.origin.col + placed_room.width - 1);
  } else if (placed_room_connection_side === "bottom") {
    var connection_cell_row = placed_room.origin.row + placed_room.height;
    var connection_cell_column = random(placed_room.origin.col, placed_room.origin.col + placed_room.width - 1);
  } else if (placed_room_connection_side === "left") {
    var connection_cell_column = placed_room.origin.col - 1;
    var connection_cell_row = random(placed_room.origin.row, placed_room.origin.row + placed_room.height - 1);
  } else if (placed_room_connection_side === "right") {
    var connection_cell_column = placed_room.origin.col + placed_room.width;
    var connection_cell_row = random(placed_room.origin.row, placed_room.origin.row + placed_room.height - 1);
  }

  if (placed_room_connection_side === "top" || placed_room_connection_side === "bottom") {
    var unplaced_room_connection_position = random(0, unplaced_room.width - 1);
  } else if (placed_room_connection_side === "left" || placed_room_connection_side === "right") {
    var unplaced_room_connection_position = random(0, unplaced_room.height - 1);
  }

  var connection_cell = {
    row: connection_cell_row,
    col: connection_cell_column
  };

  var unplaced_room_origin =
    get_unplaced_room_origin(placed_room_connection_side, connection_cell, unplaced_room_connection_position);

  return {
    connection_cell: connection_cell,
    unplaced_room_origin: unplaced_room_origin
  }
};

const get_unplaced_room_origin = (placed_room_connection_side, connection_cell, unplaced_room_connection_position) => {
  if (placed_room_connection_side === "top") {   // connection is on top of placed room
    var unplaced_room_row = connection_cell.row - 1;
    var unplaced_room_column = connection_cell.col - unplaced_room_connection_position;
  } else if (placed_room_connection_side === "bottom") {
    var unplaced_room_row = connection_cell.row + 1;
    var unplaced_room_column = connection_cell.col - unplaced_room_connection_position;
  } else if (placed_room_connection_side === "left") {
    var unplaced_room_column = connection_cell.col - 1;
    var unplaced_room_row = connection_cell.row - unplaced_room_connection_position;
  } else if (placed_room_connection_side === "right") {
    var unplaced_room_column = connection_cell.col + 1;
    var unplaced_room_row = connection_cell.row - unplaced_room_connection_position;
  }

  return {
    row: unplaced_room_row,
    col: unplaced_room_column
  };
};

const get_dungeon = ({
  total_number_of_rows, total_number_of_columns, number_of_rooms, max_width, min_width,
  max_height, min_height
}) => {
  var rooms = get_random_rooms(number_of_rooms, max_width, min_width, max_height, min_height);
  var unplaced_rooms = rooms;
  var placed_rooms = [];
  var connection_cells_between_rooms = [];

  var a_room_index = select_a_random_room_index(unplaced_rooms);
  var room_position = position_room_randomly_on_board(total_number_of_rows,
    total_number_of_columns,
    unplaced_rooms[a_room_index]);

  unplaced_rooms[a_room_index].origin = room_position;

  placed_rooms.push(unplaced_rooms[a_room_index]);
  unplaced_rooms.splice(a_room_index, 1);

  while (unplaced_rooms.length != 0) {
    var placed_room_index = select_a_random_room_index(placed_rooms);
    var unplaced_room_index = select_a_random_room_index(unplaced_rooms);

    for (var i = 0; i < 10; i++) {
      var outcome = try_to_create_connection_at_a_random_place_between_rooms(total_number_of_rows,
        total_number_of_columns,
        placed_rooms[placed_room_index],
        unplaced_rooms[unplaced_room_index]);

      if (!does_unplaced_room_overlap(outcome.unplaced_room_origin, unplaced_rooms[unplaced_room_index], placed_rooms)) {
        unplaced_rooms[unplaced_room_index].origin = outcome.unplaced_room_origin;
        placed_rooms.push(unplaced_rooms[unplaced_room_index]);
        unplaced_rooms.splice(unplaced_room_index, 1);
        connection_cells_between_rooms.push(outcome.connection_cell);
        break;
      }
    }
  }

  return {
    rooms: placed_rooms,
    connection_cells: connection_cells_between_rooms
  };

};

export default get_dungeon;