import React from 'react';
import {get_player_attack} from '../gameobjects/player';

const GameMenu = ({dungeonLevel, player}) => (
  <div className="menu">
    <div className="game-info">
      <ul>
        <li>
          <span className="label">Health: </span>
          <span>{player.health}</span>
        </li>

        <li>
          <span className="label">Weapon: </span>
          <span>{player.weapon.name}</span>
        </li>

        <li>
          <span className="label">Attack: </span>
          <span>{get_player_attack(player)}</span>

        </li>

        <li>
          <span className="label">Level: </span>
          <span>{player.level}</span>
        </li>

        <li>
          <span className="label">Dungeon Level: </span>
          <span>{dungeonLevel}</span>
        </li>
      </ul>
    </div>

    <div className="button-panel">
      <button className="toggle-button" id="toggler">Toggle Darkness</button>
    </div>
  </div>
);

export default GameMenu;
