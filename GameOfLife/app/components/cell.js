import React, {Component} from 'react';

export default ({id, val}) => {
  const cellColorClass = val === 0 ? "dead" : val === 1 ? "new-alive" : "old-alive";
  return <div id={id} className={`cell ${cellColorClass}`}></div>;
}