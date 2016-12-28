import React, {Component} from 'react';
import get_dungeon from '../gameobjects/dungeon';
import get_player from '../gameobjects/player';
import get_enemies from '../gameobjects/enemies';
import get_weapons from '../gameobjects/weapons';
import get_healths from '../gameobjects/healths';
import get_transporter from '../gameobjects/transporter';
import get_boss from '../gameobjects/boss';
import LightScreen from '../screens/LightScreen';
import move from '../actionhandlers/move';
import _ from 'lodash';
import GameScreen from './GameScreen';
import GameMenu from './GameMenu';
import humane from 'humane-js';

const notifier = humane.create({baseCls: 'humane-jackedup', timeout: 4000});
notifier.error = notifier.spawn({addnCls: 'humane-jackedup-error'});
notifier.success = notifier.spawn({addnCls: 'humane-jackedup-success'});

class Board extends Component {

  constructor(props) {
    super(props);

    /*
     All possible attributes are shown below for documentation purposes.
     The state object will be initialized later.
     */

    this.handleKeyPress = _.throttle(this.handleKeyPress.bind(this), 100);
    this.resetGame = this.resetGame.bind(this);

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
      screen: new LightScreen(props.game_args.total_number_of_rows, props.game_args.total_number_of_columns)
    };
  }


  readyGame(dungeonLevel) {
    var number_of_enemies = 10;
    var number_of_healths = 8;
    var gameObjects = [];

    var game_args = this.props.game_args;

    const dungeon = get_dungeon(game_args);

    const player = get_player(dungeon, dungeonLevel, this.state.player);
    gameObjects.push(player);

    const enemies = get_enemies(dungeon, dungeonLevel, gameObjects, number_of_enemies);
    Array.prototype.push.apply(gameObjects, enemies);

    var boss, transporter = null;
    if (dungeonLevel === 4) { //  Last level
      boss = get_boss(dungeon, gameObjects);
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

  resetGame() {
    var resetGameStatus = this.readyGame(1);
    resetGameStatus.gameOver = false;
    resetGameStatus.playerWon = false;
    this.setState(resetGameStatus);
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
    return !this.state.gameOver && !this.state.playerWon && (
        e.key === "ArrowRight" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown"
      );
  };

  handleKeyPress(e) {
    if (this.isKeyPressEventConsumable(e)) {
      var newGameState = move(e.key, this.state);

      if (newGameState.gameOver) {
        notifier.error('You are dead, Bruh!');
        this.setState({gameOver: true});
        setTimeout(() => this.resetGame(), 1000);
      } else if (newGameState.playerWon) {
        notifier.success("You are victorious, Bruh!");
        this.setState({playerWon: true});
      } else if (newGameState.dungeonLevel === this.state.dungeonLevel + 1) {
        this.setState(this.readyGame(newGameState.dungeonLevel));
      } else {
        this.setState(newGameState);
      }
      e.preventDefault();
    }
  }

  render() {
    return (
      <BoardSlave {...this.state} />
    );
  }
}

const BoardSlave = (props) => (
  <div className="game-holder">
    <GameMenu
      dungeonLevel={props.dungeonLevel}
      player={props.player}
    />

    <GameScreen {...props}/>
  </div>
);


export default Board;
