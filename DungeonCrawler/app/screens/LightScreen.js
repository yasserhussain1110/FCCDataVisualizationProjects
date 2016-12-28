import Screen from './Screen';
import {convert_to_1d_index} from '../algo/common';
import React from 'react';

class LightScreen extends Screen {
  constructor(totalNumberOfRows, totalNumberOfCols) {
    super();
    this.totalNumberOfRows = totalNumberOfRows;
    this.totalNumberOfCols = totalNumberOfCols;
  }

  getVisibleNumberOfRows() {
    return Math.floor(this.totalNumberOfRows / 3);
  }

  getTotalNumberOfCols() {
    return this.totalNumberOfCols;
  }

  getTotalNumberOfRows() {
    return this.totalNumberOfRows;
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

  placeRooms(rooms) {
    for (var i = 0; i < rooms.length; i++) {
      var room = rooms[i];
      if (this.doesRoomLieOnScreen(room)) {
        this.projectRoomOnScreen(room);
      }
    }
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

  doesRoomLieOnScreen(room) {
    return !(
      // won't lie condition
      this.endRow < room.origin.row || this.startRow > room.origin.row + room.height - 1
    );
  }

  placeConnectionCells(connection_cells) {
    for (var i = 0; i < connection_cells.length; i++) {
      var connection_cell = connection_cells[i];
      if (this.doesSingleTileObjectLieOnScreen(connection_cell)) {
        this.projectSingleTileObjectOnScreen(connection_cell, "room");
      }
    }
  }

  placePlayer(player) {
    if (this.doesSingleTileObjectLieOnScreen(player)) {
      this.projectSingleTileObjectOnScreen(player, "player");
    }
  }

  placeEnemies(enemies) {
    for (var i = 0; i < enemies.length; i++) {
      var enemy = enemies[i];
      if (this.doesSingleTileObjectLieOnScreen(enemy)) {
        this.projectSingleTileObjectOnScreen(enemy, "enemy");
      }
    }
  }

  placeWeapons(weapons) {
    for (var i = 0; i < weapons.length; i++) {
      var weapon = weapons[i];
      if (this.doesSingleTileObjectLieOnScreen(weapon)) {
        this.projectSingleTileObjectOnScreen(weapon, "weapon");
      }
    }
  }

  placeHealths(healths) {
    for (var i = 0; i < healths.length; i++) {
      var health = healths[i];
      if (this.doesSingleTileObjectLieOnScreen(health)) {
        this.projectSingleTileObjectOnScreen(health, "health");
      }
    }
  }

  placeBoss(boss) {
    if (this.doesSingleTileObjectLieOnScreen(boss)) {
      this.projectSingleTileObjectOnScreen(boss, "boss");
    }
  }

  placeTransporter(transporter) {
    if (this.doesSingleTileObjectLieOnScreen(transporter)) {
      this.projectSingleTileObjectOnScreen(transporter, "transporter");
    }
  }

  doesSingleTileObjectLieOnScreen(object) {
    var row = object.row || object.position.row;
    return row >= this.startRow && row <= this.endRow;
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
