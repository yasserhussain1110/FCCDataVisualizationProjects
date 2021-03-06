import React from 'react';

const GameScreen = ({screen, dungeon, player, enemies, weapons, healths, boss, transporter}) => {

  screen.initBoardWithPlayerPosition(player.position);

  screen.placeRooms(dungeon.rooms);

  screen.placeConnectionCells(dungeon.connection_cells);

  screen.placePlayer(player);

  screen.placeEnemies(enemies);

  screen.placeWeapons(weapons);

  screen.placeHealths(healths);


  if (boss) {
    screen.placeBoss(boss);
  }

  if (transporter) {
    screen.placeTransporter(transporter);
  }

  return <div className="game-screen">{screen.getRenderableBoard()}</div>;

};

export default GameScreen;
