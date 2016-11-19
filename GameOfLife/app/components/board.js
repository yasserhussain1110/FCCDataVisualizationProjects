import React, {Component} from 'react';
import _ from 'lodash';
import Cell from './cell';

const sizeToRowColumnMap = {
  small: [30, 58],
  medium: [55, 75],
  large: [80, 91]
};

export default ({boardSize}) => {
  const rowAndCol = sizeToRowColumnMap[boardSize];
  return (
    <div className={`board ${boardSize}`}>{_.range(rowAndCol[0] * rowAndCol[1]).map(i =>
      <Cell key={i} id={i} isLiving={false}/>)}
    </div>
  );
};