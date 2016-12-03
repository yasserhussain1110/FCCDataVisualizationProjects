import React, {Component} from 'react';
import Header from './header';
import Notice from './notice';
import Board from './board';
import BottomMenu from './bottom_menu';
import ControlPanel from './control_panel';

const createBoardWithRowsAndCols = (size, rows, columns) => ({
  board: {
    size: size,
    rows: rows,
    columns: columns,
    cells: Array(rows * columns).fill(0)
  }
});

const boards = {
  small:  createBoardWithRowsAndCols("small", 30, 58),
  medium: createBoardWithRowsAndCols("medium", 55, 75),
  large:  createBoardWithRowsAndCols("large", 80, 91)
};

const giveLifeToCellsRandomly = (board) => {
  var length = board.length;
  var copyBoard = board.slice();
  var fractionFilled = 1/10;
  for (var i=0; i < length * fractionFilled; i++) {
    var randomCell = (Math.random() * length) | 0;
    copyBoard[randomCell] = 1;
  }
  return copyBoard;
};

export default class App extends Component {
  constructor(props) {
    super(props);

    this.changeBoardSpeed = this.changeBoardSpeed.bind(this);
    this.changeBoardSize  = this.changeBoardSize.bind(this);
    this.updateBoard      = this.updateBoard.bind(this);

    this.state = {
      boardSpeed: "medium",  // slow, medium, fast
      gameInterval: null,
      board: {
        size: "medium",
        rows: 55,
        columns: 75,
        cells: Array(55 * 75).fill(0)
      }
    };
  }

  updateBoard() {
    const currentBoard =  this.state.board;
    var nextGenerationCells = this.getNextGenerationCells();
    this.setState({
      board: {
        size: currentBoard.size,
        rows: currentBoard.rows,
        columns: currentBoard.columns,
        cells: nextGenerationCells
      }
    });
  }

  getAllNeighbours(index) {
    var row = (index / this.state.board.columns) |0;
    var column = index - row * this.state.board.columns;

    var neighbours = [];

    for (var i=-1; i<=1; i++) {
      for (var j=-1; j<=1; j++) {

        if (i === 0 && j === 0) {
          continue;
        }

        var neighbourRow = row + i;
        var neighbourColumn = column + j;

        if (neighbourRow >= this.state.board.rows) {
          neighbourRow -= this.state.board.rows;
        }

        if (neighbourRow < 0) {
          neighbourRow += this.state.board.rows;
        }

        if (neighbourColumn >= this.state.board.columns) {
          neighbourColumn -= this.state.board.columns;
        }

        if (neighbourColumn < 0) {
          neighbourColumn += this.state.board.columns;
        }

        var neighbourIndex = neighbourRow * this.state.board.columns + neighbourColumn;
        neighbours.push(neighbourIndex);
      }
    }

    return neighbours;
  }

  countLiveCells(allIndices) {
    return allIndices
      .map(i => this.state.board.cells[i])
      .filter(aliveState => aliveState > 0)
      .length;
  }

  getNextGenerationCells() {
    var nextGeneration = [];
    var currentGeneration = this.state.board.cells;
    for (var i=0; i < currentGeneration.length; i++) {
      var cellState = currentGeneration[i];
      var correspondingState = cellState;
      var numberOfLiveCells = this.countLiveCells(this.getAllNeighbours(i));

      if (cellState > 0) {
        if (numberOfLiveCells < 2) {
          correspondingState = 0;
        } else if (numberOfLiveCells >= 2 && numberOfLiveCells <= 3) {
          correspondingState = 2;
        } else if (numberOfLiveCells > 3) {
          correspondingState = 0;
        }
      } else if (cellState === 0) {
        if (numberOfLiveCells === 3) {
          correspondingState = 1;
        }
      }

      nextGeneration.push(correspondingState);
    }
    return nextGeneration;
  }

  componentDidMount() {
    const currentBoard =  this.state.board;
    var boardWithAliveCells = giveLifeToCellsRandomly(currentBoard.cells);
    this.setState({
      board: {
        size: currentBoard.size,
        rows: currentBoard.rows,
        columns: currentBoard.columns,
        cells: boardWithAliveCells
      }
    });

    this.state.gameInterval = setInterval(this.updateBoard, 2000);
  }

  changeBoardSpeed(newSpeed) {
    this.setState({boardSpeed: newSpeed});
  }

  changeBoardSize(newSize) {
    var board = boards[newSize];
    var boardWithAliveCells = giveLifeToCellsRandomly(board.cells);
    this.setState({
      board: {
        size: board.size,
        rows: board.rows,
        columns: board.columns,
        cells: boardWithAliveCells
      }
    });
  }

  render() {
    return (
      <div id="#app">
        <Header />
        <ControlPanel />
        <Board board={this.state.board} />
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