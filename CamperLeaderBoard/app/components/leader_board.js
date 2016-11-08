import React from 'react';
import LeaderTable from './leader_table'

export default ({campers, changeSelection, currentSelection}) => {
  return (
    <div className="board">
      <h3>Leaderboard</h3>
      <LeaderTable currentSelection={currentSelection} changeSelection={changeSelection} campers={campers}/>
    </div>
  )
};
