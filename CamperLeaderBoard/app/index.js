import './style.scss';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import request from 'superagent';

import Header from './components/header';
import LeaderBoard from './components/leader_board';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {currentSelection: 'past30', past30Campers: [], allTimeCampers: []};

    request
      .get('https://fcctop100.herokuapp.com/api/fccusers/top/recent')
      .end((err, res) => {
        this.setState({'past30Campers': res.body});
      });

    request
      .get('https://fcctop100.herokuapp.com/api/fccusers/top/alltime')
      .end((err, res) => {
        this.setState({'allTimeCampers': res.body});
      });
  }

  render() {
    if (this.state.currentSelection === 'past30') {
      var campers = this.state.past30Campers;
    } else if (this.state.currentSelection === 'alltime') {
      var campers = this.state.allTimeCampers;
    }

    return (
      <div className="container">
        <Header />
        <LeaderBoard
          changeSelection={(currentSelection)=>this.setState({currentSelection})}
          currentSelection={this.currentSelection}
          campers={campers}/>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('.parent'));
