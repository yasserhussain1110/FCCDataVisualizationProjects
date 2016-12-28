import React from 'react';
import Board from './Board';

const App = (props) => {
  return (
    <div id="app">
      <h1>React Roguelike</h1>
      <h4>Kill the boss in dungeon 4</h4>
      <Board game_args={props.game_args}/>
    </div>
  );
};

export default App;

App.defaultProps = {
  game_args: {
    total_number_of_rows: 102,
    total_number_of_columns: 100,
    number_of_rooms: 20,
    max_width: 20,
    min_width: 4,
    max_height: 20,
    min_height: 4
  }
};
