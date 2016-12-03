import React, {Component} from 'react';

export default ({id, val, onCellSelect}) => {
  const cellColorClass = val === 0 ? "dead" : val === 1 ? "new-alive" : "old-alive";
  return <div id={id} onClick={onCellSelect} className={`cell ${cellColorClass}`}></div>;
}