class Screen {
  constructor(totalNumberOfRows, totalNumberOfCols) {
    this.totalNumberOfRows = totalNumberOfRows;
    this.totalNumberOfCols = totalNumberOfCols;
  }

  placeWeapons(weapons) {
    for (var i = 0; i < weapons.length; i++) {
      var weapon = weapons[i];
      if (this.doesSingleTileObjectLieOnScreen(weapon)) {
        this.projectSingleTileObjectOnScreen(weapon, "weapon");
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

  placeHealths(healths) {
    for (var i = 0; i < healths.length; i++) {
      var health = healths[i];
      if (this.doesSingleTileObjectLieOnScreen(health)) {
        this.projectSingleTileObjectOnScreen(health, "health");
      }
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

  placePlayer(player) {
    if (this.doesSingleTileObjectLieOnScreen(player)) {
      this.projectSingleTileObjectOnScreen(player, "player");
    }
  }

  placeConnectionCells(connection_cells) {
    for (var i = 0; i < connection_cells.length; i++) {
      var connection_cell = connection_cells[i];
      if (this.doesSingleTileObjectLieOnScreen(connection_cell)) {
        this.projectSingleTileObjectOnScreen(connection_cell, "room");
      }
    }
  }

  doesSingleTileObjectLieOnScreen(object) {
    var row = object.row || object.position.row;
    return row >= this.startRow && row <= this.endRow;
  }

  doesRoomLieOnScreen(room) {
    return !(
      // won't lie condition
      this.endRow < room.origin.row || this.startRow > room.origin.row + room.height - 1
    );
  }

  placeRooms(rooms) {
    for (var i = 0; i < rooms.length; i++) {
      var room = rooms[i];
      if (this.doesRoomLieOnScreen(room)) {
        this.projectRoomOnScreen(room);
      }
    }
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
}

export default Screen;
