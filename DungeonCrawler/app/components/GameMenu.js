import React from 'react';
import {get_standard_player_attack} from '../gameobjects/player';

const GameMenu = ({dungeonLevel, player, toggleScreen}) => (
  <div className="menu">
    <div className="game-info">
      <ul>
        <li className="health-menu">
          <span className="label">Health: </span>
          <span>{player.health}</span>
        </li>

        <li className="weapon-menu">
          <span className="label">Weapon: </span>
          <span>{player.weapon.name}</span>
        </li>

        <li className="exp-menu">
          <span className="label">Exp: </span>
          <span>{player.experience}</span>
        </li>

        <li className="attack-menu">
          <span className="label">Attack: </span>
          <span>{get_standard_player_attack(player)}</span>
        </li>

        <li className="level-menu">
          <span className="label">Level: </span>
          <span>{player.level}</span>
        </li>

        <li className="dg-level-menu">
          <span className="label">Dungeon Level: </span>
          <span>{dungeonLevel}</span>
        </li>
      </ul>
    </div>

    <div className="button-panel">
      <button onClick={toggleScreen} className="toggle-button" id="toggler">Toggle Darkness</button>
    </div>
  </div>
);

export default GameMenu;
