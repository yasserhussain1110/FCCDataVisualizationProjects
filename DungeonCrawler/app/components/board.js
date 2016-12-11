import React from 'react';
import get_dungeon from '../algo/get_dungeon';

/* 100 by 33 viewing area tile board */
/* 100 by 102 total area tile board */

export default () => {

  var args = {
    total_number_of_rows: 102,
    total_number_of_columns: 100,
    number_of_rooms: 10,
    max_width: 25,
    min_width: 4,
    max_height: 25,
    min_height: 4
  };


  var board_array = Array(args.total_number_of_columns * args.total_number_of_rows);

  var result = get_dungeon(args);
  var rooms = result.rooms;
  var connection_cells = result.connection_cells;

  console.log(rooms);

  for (var i = 0; i < board_array.length; i++) {
    board_array[i] = <span key={i} className="tile wall"></span>;
  }

  for (var i = 0; i < rooms.length; i++) {
    var r = rooms[i];

    for (var row = r.origin.row; row < r.origin.row + r.height; row++) {
      for (var col = r.origin.col; col < r.origin.col + r.width; col++) {
        var index = convert_to_1d_index(row, col, args.total_number_of_columns);
        board_array[index] = <span key={index} className="tile room"></span>;
      }
    }
  }


  for (var i = 0; i < connection_cells.length; i++) {
    var c = connection_cells[i];
    var index = convert_to_1d_index(c.row, c.col, args.total_number_of_columns);
    board_array[index] = <span key={index} className="tile room"></span>;
  }


  return <div className="board">{board_array}</div>;
}

const convert_to_1d_index = (row, col, number_of_cols) => (row * number_of_cols + col);
