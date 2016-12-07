import React, {Component} from 'react';
import Board from './board';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="app">
        <Board/>
      </div>
    );
  }
}

export default App;