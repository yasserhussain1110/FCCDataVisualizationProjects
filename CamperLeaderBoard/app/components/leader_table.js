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
