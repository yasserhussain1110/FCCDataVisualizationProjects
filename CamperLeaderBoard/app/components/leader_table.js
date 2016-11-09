import React from 'react';
import Camper from './camper';

export default ({currentSelection, campers, changeSelection}) => {

  if (campers.length == 0) {
    return (
      <div>Loading...</div>
    );
  }

  const camperRows = campers.map(function (eachCamper, index) {
    return <Camper key={eachCamper.username} index={index} camper={eachCamper}/>;
  });

  var past30Class = "sortable";
  var alltimeClass = "sortable";

  if (currentSelection === 'past30') {
    past30Class += " sorted";
  } else if (currentSelection === 'alltime') {
    alltimeClass += " sorted";
  }

  return (
    <table className="table table-striped table-bordered">
      <thead>
      <tr>
        <th>#</th>
        <th>Camper Name</th>
        <th className={past30Class}
            onClick={(v)=>
              changeSelection("past30")}>Points in the past 30 days
        </th>
        <th className={alltimeClass}
            onClick={(v)=>
              changeSelection("alltime")}>All time points
        </th>
      </tr>
      </thead>
      <tbody>
      {camperRows}
      </tbody>
    </table>
  );
};
