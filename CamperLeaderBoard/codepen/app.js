var request = superagent;

var Camper = ({index, camper}) => {
  return (
    <tr>
      <td>{index+1}</td>
      <td className="camper-name"><a href={"https://www.freecodecamp.com/"+camper.username}>
        <img className="userimg" src={camper.img} />{camper.username}
      </a>
      </td>
      <td className="camper-recent">{camper.recent}</td>
      <td className="camper-alltime">{camper.alltime}</td>
    </tr>
  );
};

var LeaderTable = ({campers, changeSelection}) => {

  if (campers.length == 0) {
    return (
      <div>Loading...</div>
    );
  }

  const camperRows = campers.map(function (eachCamper, index) {
    return <Camper key={eachCamper.username} index={index} camper={eachCamper}/>;
  });

  const handleClick = (target, newSelection) => {
    updateSelectionUI(target);
    changeSelection(newSelection);
  };

  return (
    <table className="table table-striped table-bordered">
      <thead>
      <tr>
        <th>#</th>
        <th>Camper Name</th>
        <th className="sorted sortable"
            onClick={(v)=>
              handleClick(v.target, "past30")}>Points in the past 30 days
        </th>
        <th className="sortable"
            onClick={(v)=>
              handleClick(v.target, "alltime")}>All time points
        </th>
      </tr>
      </thead>
      <tbody>
      {camperRows}
      </tbody>
    </table>
  );
};


const updateSelectionUI = (target) => {
  $(".sortable").removeClass("sorted");
  $(target).addClass("sorted");
};

var LeaderBoard = ({campers, changeSelection, currentSelection}) => {
  return (
    <div className="board">
      <h3>Leaderboard</h3>
      <LeaderTable currentSelection={currentSelection} changeSelection={changeSelection} campers={campers}/>
    </div>
  )
};

var Header = () => {
  return (
    <header>
      <a href="https://www.freecodecamp.com">
        <img className="fcclogo"
             src="https://s3.amazonaws.com/freecodecamp/freecodecamp_logo.svg" alt="FreeCodeCamp"/>
      </a>
    </header>
  );
};

class App extends React.Component {
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