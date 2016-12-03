import React, {Component} from 'react';
import Header from './header';
import Notice from './notice';
import Board from './board';
import BottomMenu from './bottom_menu';
import ControlPanel from './control_panel';

const unique = (a) => {
  var seen = {};
  var out = [];
  var len = a.length;
  var j = 0;
  for(var i = 0; i < len; i++) {
    var item = a[i];
    if(seen[item] !== 1) {
      seen[item] = 1;
      out[j++] = item;
    }
  }
  return out;
};

const createNewBoardFromOldBoardAndNextGenCells = (boardCells, aliveCellIndices) => {
  var newBoard = Array(boardCells.length).fill(0);
  for (var i=0; i<aliveCellIndices.length; i++) {
    var aliveCellIndex = aliveCellIndices[i];
    if (boardCells[aliveCellIndex] === 0) {
      newBoard[aliveCellIndex] = 1;
    } else {
      newBoard[aliveCellIndex] = 2;
    }
  }
  return newBoard;
};

const createBoardWithRowsAndCols = (size, rows, columns) => ({
    size: size,
    rows: rows,
    columns: columns,
    cells: Array(rows * columns).fill(0)
});

const boards = {
  small:  createBoardWithRowsAndCols("small", 30, 58),
  medium: createBoardWithRowsAndCols("medium", 55, 75),
  large:  createBoardWithRowsAndCols("large", 80, 91)
};

const getSpeedObject = (speed, ticks) => ({
  speed: speed,
  ticks: ticks
});

const gameSpeed = {
  slow   : getSpeedObject("slow", 1000),
  medium : getSpeedObject("medium", 600),
  fast   : getSpeedObject("fast", 200),
};

const giveLifeToCellsRandomly = (length) => {
  var aliveCellIndices = [];
  var fractionFilled = 1/8;
  for (var i=0; i < length * fractionFilled; i++) {
    var randomCell = (Math.random() * length) | 0;
    aliveCellIndices.push(randomCell);
  }
  return aliveCellIndices;
};

export default class App extends Component {
  constructor(props) {
    super(props);

    this.changeBoardSpeed = this.changeBoardSpeed.bind(this);
    this.changeBoardSize  = this.changeBoardSize.bind(this);
    this.updateBoard      = this.updateBoard.bind(this);

    this.state = {
      gameInterval: null,
      speedObject: {
        speed: "medium", // slow, medium, fast
        ticks: 600,
      },
      board: {
        size: "medium",  // small, medium, large
        rows: 55,
        columns: 75,
        liveCellIndices: [],
        cells: Array(55 * 75).fill(0)
      }
    };
  }

  updateBoard() {
    const currentBoard =  this.state.board;
    var nextGenerationLiveCellIndices = this.getNextGenerationLiveCellIndices();

    var cells = createNewBoardFromOldBoardAndNextGenCells(currentBoard.cells, nextGenerationLiveCellIndices);
    this.setState({
      board: {
        size: currentBoard.size,
        rows: currentBoard.rows,
        columns: currentBoard.columns,
        liveCellIndices: nextGenerationLiveCellIndices,
        cells: cells
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
    var numberOfLiveCells = 0;
    for (var i=0; i<allIndices.length; i++) {
      if (this.state.board.cells[allIndices[i]] > 0) {
        numberOfLiveCells++;
      }
      if (numberOfLiveCells > 3) {
        break;
      }
    }
    return numberOfLiveCells;
  }

  getNextGenerationLiveCellIndices() {
    var neighbourIndexList = [];
    var nextGenLive = [];
    var liveCellIndices = this.state.board.liveCellIndices;

    for (var i=0; i<liveCellIndices.length; i++) {
      var neighbours = this.getAllNeighbours(liveCellIndices[i]);
      Array.prototype.push.apply(neighbourIndexList, neighbours);
    }
    Array.prototype.push.apply(neighbourIndexList, liveCellIndices);

    var finalNeighbourIndexList = unique(neighbourIndexList);

    for (var i=0; i<finalNeighbourIndexList.length; i++) {
      var cell = finalNeighbourIndexList[i];
      if (this.willCellLive(cell)) {
        nextGenLive.push(cell);
      }
    }

    return nextGenLive;
  }

  willCellLive(i) {
    var isAlive = this.state.board.cells[i] > 0;
    var allNeighbours = this.getAllNeighbours(i);
    var numberOfLiveCells = this.countLiveCells(allNeighbours);

    return (isAlive && numberOfLiveCells >= 2 && numberOfLiveCells <= 3) ||
    (!isAlive && numberOfLiveCells === 3);
  }

  componentDidMount() {
    const currentBoard =  this.state.board;
    var liveCellIndices = giveLifeToCellsRandomly(currentBoard.cells.length);
    var cells = createNewBoardFromOldBoardAndNextGenCells(this.state.board.cells, liveCellIndices);
    this.setState({
      board: {
        size: currentBoard.size,
        rows: currentBoard.rows,
        columns: currentBoard.columns,
        liveCellIndices: liveCellIndices,
        cells: cells
      }
    });

    this.state.gameInterval = setInterval(this.updateBoard, this.state.speedObject.ticks);
  }

  changeBoardSpeed(newSpeed) {
    clearInterval(this.state.gameInterval);
    const speedObject = gameSpeed[newSpeed];
    this.state.gameInterval = setInterval(this.updateBoard, speedObject.ticks);
    this.setState({speedObject});
  }

  changeBoardSize(newSize) {
    var board = boards[newSize];
    var liveCellIndices = giveLifeToCellsRandomly(board.cells.length);
    var cells = createNewBoardFromOldBoardAndNextGenCells(board.cells, liveCellIndices);
    this.setState({
      board: {
        size: board.size,
        rows: board.rows,
        columns: board.columns,
        liveCellIndices: liveCellIndices,
        cells: cells
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
          currentBoardSpeed={this.state.speedObject.speed}
          currentBoardSize={this.state.board.size}
          changeBoardSpeed={this.changeBoardSpeed}
          changeBoardSize={this.changeBoardSize} />
        <Notice />
      </div>
    );
  }
}