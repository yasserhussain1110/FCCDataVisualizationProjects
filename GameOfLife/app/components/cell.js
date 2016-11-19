import React, {Component} from 'react';

export default ({id, isLiving}) => {
  const cellColorClass = isLiving ? "alive" : "dead";
  return <div id={id} className={`cell ${cellColorClass}`}></div>;
}