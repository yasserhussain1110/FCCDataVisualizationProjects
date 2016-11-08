import React from 'react';
import Camper from './camper';

export default ({campers, changeSelection}) => {

  if (campers.length == 0) {
    return (
      <div>Loading...</div>
    );
  }

  const camperRows = campers.map(function (eachCamper, index) {
    return <Camper key={eachCamper.username} index={index} camper={eachCamper}/>;
  });

  return (
    <table className="table table-striped table-bordered">
      <thead>
      <tr>
        <th>#</th>
        <th>Camper Name</th>
        <th onClick={()=>changeSelection("past30")}>Points in the past 30 days</th>
        <th onClick={()=>changeSelection("alltime")}>All time points</th>
      </tr>
      </thead>
      <tbody>
      {camperRows}
      </tbody>
    </table>
  );
};
