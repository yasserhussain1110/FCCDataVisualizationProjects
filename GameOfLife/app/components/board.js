import React, {Component} from 'react';
import Cell from './cell';

const getCellElementListFromBoardCellArray = (cells, onCellSelect) => (
  cells.map((val, index) => <Cell key={index} onCellSelect={onCellSelect.bind(null, index)} id={index} val={val}/>)
);

export default ({onCellSelect, board}) => {
  return (
    <div className={`board ${board.size}`}>{getCellElementListFromBoardCellArray(board.cells, onCellSelect)}</div>
  );
};