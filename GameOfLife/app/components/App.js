import React, {Component} from 'react';
import Header from './header';
import Notice from './notice';
import Board from './board';
import BottomMenu from './bottom_menu';
import ControlPanel from './control_panel';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.changeBoardSpeed = this.changeBoardSpeed.bind(this);
    this.changeBoardSize = this.changeBoardSize.bind(this);

    this.state = {
      boardSize: "medium",  // small, medium, large
      boardSpeed: "medium"  // slow, medium, fast
    };
  }

  changeBoardSpeed(newSpeed) {
    this.setState({boardSpeed: newSpeed});
  }

  changeBoardSize(newSize) {
    this.setState({boardSize: newSize});
  }

  render() {
    return (
      <div id="#app">
        <Header />
        <ControlPanel />
        <Board boardSize={this.state.boardSize} />
        <BottomMenu
          currentBoardSpeed={this.state.boardSpeed}
          currentBoardSize={this.state.boardSize}
          changeBoardSpeed={this.changeBoardSpeed}
          changeBoardSize={this.changeBoardSize}/>
        <Notice />
      </div>
    );
  }
}