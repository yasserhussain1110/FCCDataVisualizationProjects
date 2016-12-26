import React from 'react';

const convert_to_1d_index = (row, col, number_of_cols) => (row * number_of_cols + col);


export default ({total_number_of_rows, total_number_of_columns, dungeon, player, enemies, weapons, healths, boss, transporter}) => {

  var board_array = get_board_array(35, total_number_of_columns);

  /*

  place_rooms_on_board_array(board_array, dungeon.rooms, total_number_of_columns);

  place_connection_cells_on_board_array(board_array, dungeon.connection_cells, total_number_of_columns);

  place_player_on_board_array(board_array, player, total_number_of_columns);

  place_enemies_on_board_array(board_array, enemies, total_number_of_columns);

  place_weapons_on_board_array(board_array, weapons, total_number_of_columns);

  place_healths_on_board_array(board_array, healths, total_number_of_columns);

  place_boss_on_board_array(board_array, boss, total_number_of_columns);

  place_transporter_on_board_array(board_array, transporter, total_number_of_columns); */

  return <div className="board">{board_array}</div>;
};

const place_boss_on_board_array = (board_array, boss, total_number_of_columns) => {
  if (boss) {
    var index = convert_to_1d_index(boss.position.row, boss.position.col, total_number_of_columns);
    board_array[index] = <span key={index} className="tile boss"></span>;
  }
};

const place_transporter_on_board_array = (board_array, transporter, total_number_of_columns) => {
  if (transporter) {
    var index = convert_to_1d_index(transporter.position.row, transporter.position.col, total_number_of_columns);
    board_array[index] = <span key={index} className="tile transporter"></span>;
  }
};

const place_healths_on_board_array = (board_array, healths, total_number_of_columns) => {
  for (var i = 0; i < healths.length; i++) {
    var h = healths[i];
    var index = convert_to_1d_index(h.position.row, h.position.col, total_number_of_columns);
    board_array[index] = <span key={index} className="tile health"></span>;
  }
};

const place_weapons_on_board_array = (board_array, weapons, total_number_of_columns) => {
  for (var i = 0; i < weapons.length; i++) {
    var w = weapons[i];
    var index = convert_to_1d_index(w.position.row, w.position.col, total_number_of_columns);
    board_array[index] = <span key={index} className="tile weapon"></span>;
  }
};

const place_enemies_on_board_array = (board_array, enemies, total_number_of_columns) => {
  for (var i = 0; i < enemies.length; i++) {
    var e = enemies[i];
    var index = convert_to_1d_index(e.position.row, e.position.col, total_number_of_columns);
    board_array[index] = <span key={index} className="tile enemy"></span>;
  }
};

const place_player_on_board_array = (board_array, player, total_number_of_columns) => {
  var index = convert_to_1d_index(player.position.row, player.position.col, total_number_of_columns);
  board_array[index] = <span key={index} className="tile player"></span>;
};


const place_connection_cells_on_board_array = (board_array, connection_cells, total_number_of_columns) => {
  for (var i = 0; i < connection_cells.length; i++) {
    var c = connection_cells[i];
    var index = convert_to_1d_index(c.row, c.col, total_number_of_columns);
    board_array[index] = <span key={index} className="tile room"></span>;
  }
};

const get_board_array = (total_number_of_rows, total_number_of_columns) => {
  var board_array = Array(total_number_of_rows * total_number_of_columns);

  for (var i = 0; i < board_array.length; i++) {
    board_array[i] = <span key={i} className="tile wall"></span>;
  }

  return board_array;
};

const place_rooms_on_board_array = (board_array, rooms, total_number_of_columns) => {
  for (var i = 0; i < rooms.length; i++) {
    var r = rooms[i];

    for (var row = r.origin.row; row < r.origin.row + r.height; row++) {
      for (var col = r.origin.col; col < r.origin.col + r.width; col++) {
        var index = convert_to_1d_index(row, col, total_number_of_columns);
        board_array[index] = <span key={index} className="tile room"></span>;
      }
    }
  }
};

