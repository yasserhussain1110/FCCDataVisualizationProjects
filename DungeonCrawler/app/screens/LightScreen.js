import Screen from './Screen';
import {convert_to_1d_index} from '../algo/common';
import React from 'react';

class LightScreen extends Screen {
  constructor(totalNumberOfRows, totalNumberOfCols) {
    super(totalNumberOfRows, totalNumberOfCols);
  }

  initBoardArray() {
    this.boardArray = Array(this.getVisibleNumberOfRows() * this.getTotalNumberOfCols());

    for (var i = 0; i < this.boardArray.length; i++) {
      this.boardArray[i] = <span key={i} className="tile wall"></span>;
    }
  }

  initPlayerPosition(player_position) {
    var rowsAbovePlayer = Math.floor((this.getVisibleNumberOfRows() - 1) / 2);
    var rowsBelowPlayer = this.getVisibleNumberOfRows() - (rowsAbovePlayer + 1);

    this.startRow = player_position.row - rowsAbovePlayer;
    this.endRow = player_position.row + rowsBelowPlayer;
  }

  initBoardWithPlayerPosition(player_position) {
    this.initBoardArray();
    this.initPlayerPosition(player_position);
  }

  projectRoomOnScreen(room) {
    var roomProjectionOnScreenStartRow = Math.max(room.origin.row, this.startRow);
    var roomProjectionOnScreenEndRow = Math.min(room.origin.row + room.height - 1, this.endRow);

    for (var row = roomProjectionOnScreenStartRow; row <= roomProjectionOnScreenEndRow; row++) {
      for (var col = room.origin.col; col < room.origin.col + room.width; col++) {
        var index = convert_to_1d_index(row - this.startRow, col, this.totalNumberOfCols);
        this.boardArray[index] = <span key={index} className="tile room"></span>;
      }
    }
  }

  projectSingleTileObjectOnScreen(object, tileClass) {
    var row = object.row || object.position.row;
    var col = object.col || object.position.col;
    var index = convert_to_1d_index(row - this.startRow, col, this.totalNumberOfCols);
    this.boardArray[index] = <span key={index} className={`tile ${tileClass}`}></span>;
  }

  getRenderableBoard() {
    return this.boardArray;
  }
}

export default LightScreen;
