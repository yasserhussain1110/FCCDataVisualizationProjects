import React from 'react';
import LeaderTable from './leader_table'

export default ({campers, changeSelection}) => {
  return (
    <div className="board">
      <h3>Leaderboard</h3>
      <LeaderTable changeSelection={changeSelection} campers={campers}/>
    </div>
  )
};
