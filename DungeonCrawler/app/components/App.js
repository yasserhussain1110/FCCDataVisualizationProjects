import React, {Component} from 'react';
import Board from './board';
import get_dungeon from '../gameobjects/dungeon';
import get_player from '../gameobjects/player';
import get_enemies from '../gameobjects/enemies';
import get_weapons from '../gameobjects/weapons';
import get_healths from '../gameobjects/healths';
import get_transporter from '../gameobjects/transporter';
import get_boss from '../gameobjects/boss';
import LightScreen from '../screens/LightScreen';
import move from '../actionhandlers/move';


const game_args = {
  total_number_of_rows: 102,
  total_number_of_columns: 100,
  number_of_rooms: 20,
  max_width: 20,
  min_width: 4,
  max_height: 20,
  min_height: 4
};

class App extends Component {
  constructor(props) {
    super(props);

    /*
     All possible attributes are shown below for documentation purposes.
     The state object will be initialized later.
     */

    this.handleKeyPress = this.handleKeyPress.bind(this);

    this.state = {
      dungeon: null,
      dungeonLevel: 1,
      player: null,
      enemies: null,
      boss: null,
      weapons: null,
      healths: null,
      transporter: null,
      gameOver: false,
      playerWon: false,
      screen: new LightScreen(game_args.total_number_of_rows, game_args.total_number_of_columns)
    };
  }

  readyGame(dungeonLevel) {
    var number_of_enemies = 10;
    var number_of_healths = 6;
    var gameObjects = [];

    const dungeon = get_dungeon(game_args);

    const player = get_player(dungeon, dungeonLevel, this.state.player);
    gameObjects.push(player);

    const enemies = get_enemies(dungeon, dungeonLevel, gameObjects, number_of_enemies);
    Array.prototype.push.apply(gameObjects, enemies);

    var boss, transporter = null;
    if (this.isLastLevel()) {
      boss = get_boss();
      gameObjects.push(boss);
    } else {
      transporter = get_transporter(dungeon, gameObjects);
      gameObjects.push(transporter);
    }

    const weapons = get_weapons(dungeon, dungeonLevel, gameObjects);
    Array.prototype.push.apply(gameObjects, weapons);

    const healths = get_healths(dungeon, dungeonLevel, gameObjects, number_of_healths);
    Array.prototype.push.apply(gameObjects, healths);

    return {
      dungeon,
      dungeonLevel,
      player,
      enemies,
      boss,
      weapons,
      healths,
      transporter
    }
  }

  componentWillMount() {
    const gameState = this.readyGame(1);
    this.setState(gameState);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyPress);
  }

  isLastLevel() {
    return this.state.dungeonLevel === 4;
  }

  isKeyPressEventConsumable(e) {
    return e.key === "ArrowRight" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowUp" ||
      e.key === "ArrowDown";
  }

  handleKeyPress(e) {
    if(this.isKeyPressEventConsumable(e)) {
      this.setState(move(e.key, this.state));
      e.preventDefault();
    }
  }

  render() {
    return (
      <div id="app">
        <Board
          {...this.state}
          total_number_of_rows={game_args.total_number_of_rows}
          total_number_of_columns={game_args.total_number_of_columns}
        />
      </div>
    );
  }
}

export default App;
