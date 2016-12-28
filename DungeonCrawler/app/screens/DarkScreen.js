import Screen from './Screen';
import React from 'react';
import {convert_to_1d_index} from '../algo/common';

class DarkScreen extends Screen {
  constructor(totalNumberOfRows, totalNumberOfCols) {
    super(totalNumberOfRows, totalNumberOfCols);
    this.octagonSize = 7;
  }

  initBoardArray() {
    this.boardArray = Array(this.getVisibleNumberOfRows() * this.getTotalNumberOfCols());

    for (var row = this.startRow; row <= this.endRow; row++) {
      for (var col = 0; col < this.totalNumberOfCols; col++) {
        var index = convert_to_1d_index(row - this.startRow, col, this.totalNumberOfCols);
        if (distance([row, col], [this.playerPosition.row, this.playerPosition.col]) <= this.octagonSize) {
          this.boardArray[index] = <span key={index} className="tile wall"></span>;
        } else {
          this.boardArray[index] = <span key={index} className="tile dark"></span>;
        }
      }
    }
  }

  initPlayerPosition(player_position) {
    var rowsAbovePlayer = Math.floor((this.getVisibleNumberOfRows() - 1) / 2);
    var rowsBelowPlayer = this.getVisibleNumberOfRows() - (rowsAbovePlayer + 1);

    this.startRow = player_position.row - rowsAbovePlayer;
    this.endRow = player_position.row + rowsBelowPlayer;
    this.playerPosition = player_position;
  }

  initBoardWithPlayerPosition(player_position) {
    this.initPlayerPosition(player_position);
    this.initBoardArray();
  }

  projectRoomOnScreen(room) {
    var roomProjectionOnScreenStartRow = Math.max(room.origin.row, this.startRow);
    var roomProjectionOnScreenEndRow = Math.min(room.origin.row + room.height - 1, this.endRow);

    for (var row = roomProjectionOnScreenStartRow; row <= roomProjectionOnScreenEndRow; row++) {
      for (var col = room.origin.col; col < room.origin.col + room.width; col++) {
        var index = convert_to_1d_index(row - this.startRow, col, this.totalNumberOfCols);
        if (distance([row, col], [this.playerPosition.row, this.playerPosition.col]) <= this.octagonSize) {
          this.boardArray[index] = <span key={index} className="tile room"></span>;
        }
      }
    }
  }

  projectSingleTileObjectOnScreen(object, tileClass) {
    var row = object.row || object.position.row;
    var col = object.col || object.position.col;
    var index = convert_to_1d_index(row - this.startRow, col, this.totalNumberOfCols);
    if (distance([row, col], [this.playerPosition.row, this.playerPosition.col]) <= this.octagonSize) {
      this.boardArray[index] = <span key={index} className={`tile ${tileClass}`}></span>;
    }
  }

  getRenderableBoard() {
    return this.boardArray;
  }

}

const distance = ([row1, col1], [row2, col2]) => (
  Math.sqrt(Math.pow(row1 - row2, 2) + Math.pow(col1 - col2, 2))
);

export default DarkScreen;
