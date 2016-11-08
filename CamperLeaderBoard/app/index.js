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
    //console.log(this.state);

    request
      .get('https://fcctop100.herokuapp.com/api/fccusers/top/recent')
      //.get('http://localhost:4440/recent')
      .end((err, res) => {
        this.setState({'past30Campers': res.body});
        //console.log("past30 success");
        //console.log(this.state);
      });

    request
      .get('https://fcctop100.herokuapp.com/api/fccusers/top/alltime')
      //.get('http://localhost:4440/alltime')
      .end((err, res) => {
        this.setState({'allTimeCampers': res.body});
        //console.log("alltime success");
        //console.log(this.state);
      });
  }

  render() {
    if (this.state.currentSelection === 'past30') {
      //console.log("In here");
      var campers = this.state.past30Campers;
      //console.log(this.state);
    } else if (this.state.currentSelection === 'alltime') {
      var campers = this.state.allTimeCampers;
    }

    //console.log(this.state.currentSelection);
    //console.log(campers);

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
