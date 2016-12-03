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
  liveCellIndices: [],
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


const getCellElementListFromBoardCellArray = (cells, onCellSelect) => (
  cells.map((val, index) => <Cell key={index} onCellSelect={onCellSelect.bind(null, index)} id={index} val={val}/>)
);

const Board = ({onCellSelect, board}) => {
  return (
    <div className={`board ${board.size}`}>{getCellElementListFromBoardCellArray(board.cells, onCellSelect)}</div>
  );
};

const BottomMenu = ({currentBoardSpeed, currentBoardSize, changeBoardSpeed, changeBoardSize}) => {

  /* A higher order function. Awesome isn't it. Picked it up from SICP */
  const getValueChecker = (className) => ( (expectedValue, currentValue) => ( expectedValue ===  currentValue ? className : "") );

  const selectBoardClassName = getValueChecker("selected");

  return (
    <div className="bottom-menu">
      <div>
        <div>Board Size:</div>
        <button
          className={selectBoardClassName("small", currentBoardSize)}
          onClick={changeBoardSize.bind(null, "small")}>Size: 50x30</button>
        <button
          className={selectBoardClassName("medium", currentBoardSize)}
          onClick={changeBoardSize.bind(null, "medium")}>Size: 70x50</button>
        <button
          className={selectBoardClassName("large", currentBoardSize)}
          onClick={changeBoardSize.bind(null, "large")}>Size: 100x80</button>
      </div>

      <div>
        <div>Sim Speed:</div>
        <button
          className={selectBoardClassName("slow", currentBoardSpeed)}
          onClick={changeBoardSpeed.bind(null, "slow")}>Slow</button>
        <button
          className={selectBoardClassName("medium", currentBoardSpeed)}
          onClick={changeBoardSpeed.bind(null, "medium")}>Medium</button>
        <button
          className={selectBoardClassName("fast", currentBoardSpeed)}
          onClick={changeBoardSpeed.bind(null, "fast")}>Fast</button>
      </div>
    </div>
  );
}

const Cell = ({id, val, onCellSelect}) => {
  const cellColorClass = val === 0 ? "dead" : val === 1 ? "new-alive" : "old-alive";
  return <div id={id} onClick={onCellSelect} className={`cell ${cellColorClass}`}></div>;
}

const convertIsPausedToClass = (paused) => (
  paused ? "paused" : ""
);

const ControlPanel = ({generation, paused, onPause, onRun, onClear}) => (
  <div className="control-panel">
    <button onClick={onRun}>Run</button>
    <button onClick={onPause} className={convertIsPausedToClass(paused)}>Pause</button>
    <button onClick={onClear}>Clear</button>
    <div className="counter">Generation: <span>{generation}</span></div>
  </div>
);

const Header = () => (
  <h1 className="header"><a href="https://www.math.cornell.edu/~lipa/mec/lesson6.html">ReactJS Game of Life</a></h1>
);

const Notice = () => (
  <div className="notice">
    <p>Feel free to add cells while it's running. The cells in light red are younger, dark red are older. Enjoy!</p>
  </div>
);






class App extends React.Component {
  constructor(props) {
    super(props);

    this.changeBoardSpeed = this.changeBoardSpeed.bind(this);
    this.changeBoardSize  = this.changeBoardSize.bind(this);
    this.updateBoard      = this.updateBoard.bind(this);
    this.invertCellState     = this.invertCellState.bind(this);
    this.pauseGame = this.pauseGame.bind(this);
    this.runGame = this.runGame.bind(this);
    this.clearGame = this.clearGame.bind(this);

    this.state = {
      paused: false,
      gameInterval: null,
      generation: 0,
      speedObject: {
        speed: "medium", // slow, medium, fast
        ticks: 600,
      },
      board: {
        size: "small",  // small, medium, large
        rows: 30,
        columns: 58,
        liveCellIndices: [],
        cells: Array(30 * 58).fill(0)
      }
    };
  }

  updateBoard() {
    const currentBoard =  this.state.board;
    if (currentBoard.liveCellIndices.length === 0) {
      clearInterval(this.state.gameInterval);
      return;
    }
    var nextGenerationLiveCellIndices = this.getNextGenerationLiveCellIndices();

    var cells = createNewBoardFromOldBoardAndNextGenCells(currentBoard.cells, nextGenerationLiveCellIndices);
    this.setState({
      generation: this.state.generation + 1,
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

  invertCellState(index) {
    var board = this.state.board;
    var isAlive = this.state.board.cells[index] > 0;

    console.log(boards);

    if (isAlive) {
      var ii = board.liveCellIndices.indexOf(index);
      board.liveCellIndices.splice(ii, 1);
      board.cells[index] = 0;
    } else {
      board.liveCellIndices.push(index);
      board.cells[index] = 1;
    }

    this.setState({board});
  }

  runGame() {
    if (this.state.paused) {
      this.setState({
        paused: false,
      });
      this.state.gameInterval = setInterval(this.updateBoard, this.state.speedObject.ticks);
    }
  }

  pauseGame() {
    this.setState({
      paused: true,
    });
    clearInterval(this.state.gameInterval);
  }

  clearGame() {
    const freshBoard = boards[this.state.board.size];
    console.log(freshBoard);
    this.setState({
      board: {
        size: freshBoard.size,
        rows: freshBoard.rows,
        columns: freshBoard.columns,
        liveCellIndices: [],
        cells: freshBoard.cells.slice()
      },
      generation: 0
    });
    this.pauseGame();
  }

  render() {
    return (
      <div id="#app">
        <Header />
        <ControlPanel
          paused={this.state.paused}
          onPause={this.pauseGame}
          onRun={this.runGame}
          onClear={this.clearGame}
          generation={this.state.generation}
        />
        <Board
          onCellSelect={this.invertCellState}
          board={this.state.board} />
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


ReactDOM.render(<App/>, document.querySelector('.container'));