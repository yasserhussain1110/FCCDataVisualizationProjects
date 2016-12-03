import React, {Component} from 'react';
import Cell from './cell';

const getCellElementListFromBoardCellArray = (cells) => (
  cells.map((val, index) => <Cell key={index} id={index} val={val}/>)
);

export default ({board}) => {
  return (
    <div className={`board ${board.size}`}>{getCellElementListFromBoardCellArray(board.cells)}</div>
  );
};