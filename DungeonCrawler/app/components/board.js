import React from 'react';
import ready_rooms from '../algo/ready_board';


/* 100 by 33 viewing area tile board */
/* 100 by 102 total area tile board */

const tile = <span className="tile wall"></span>;

export default () => {
  var rooms = ready_rooms(20, 25, 25);
  var board_array = Array(
                         100    // number of columns
                         *
                         400);  // number of rows

  for (var i = 0; i < board_array.length; i++) {
    board_array[i] = <span key={i} className="tile wall"></span>;
  }

  for (var i=0; i<rooms.length; i++) {
    var r = rooms[i];

    for (var row = r.origin[0]; row < r.origin[0] + r.height; row++) {
      for (var col = r.origin[1]; col < r.origin[1] + r.width; col++) {
        var index = convert_to_1d_index(row, col, 100);
        board_array[index] = <span key={index} className="tile room"></span>;
      }
    }
  }


  return <div className="board">{board_array}</div>;
}


const convert_to_1d_index = (row, col, number_of_cols) => (row * number_of_cols + col);