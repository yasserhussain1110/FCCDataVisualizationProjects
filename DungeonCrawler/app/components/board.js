import React from 'react';

export default ({screen, dungeon, player, enemies, weapons, healths, boss, transporter}) => {

  screen.initBoardWithPlayerPosition(player.position);

  screen.placeRoomsOnBoardArray(dungeon.rooms);

  screen.placeConnectionCellsOnBoardArray(dungeon.connection_cells);

  screen.placePlayerOnBoardArray(player);

  screen.placeEnemiesOnBoardArray(enemies);

  screen.placeWeaponsOnBoardArray(weapons);

  screen.placeHealthsOnBoardArray(healths);


  if (boss) {
    screen.placeBossOnBoardArray(boss);
  }

  if (transporter) {
    screen.placeTransporterOnBoardArray(transporter);
  }

  return <div className="board">{screen.getRenderableBoard()}</div>;
};
