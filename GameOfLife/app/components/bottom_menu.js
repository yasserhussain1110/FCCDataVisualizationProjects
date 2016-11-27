import React from 'react';

export default ({currentBoardSpeed, currentBoardSize, changeBoardSpeed, changeBoardSize}) => {

  /* A higher order function. Awesome isn't it. Picked it up from SICP */
  const getValueChecker = (className) => ( (expectedValue, currentValue) => ( expectedValue ===  currentValue ? className : "") );

  const selectBoardClassName = getValueChecker("selected");

  return (
    <div className="bottom-menu">
      <div>
        <div>Board Size:</div>
        <button
          className={selectBoardClassName("small", currentBoardSize)}
          onClick={changeBoardSize.bind(null, "small")}>Size: 50x30</button>
        <button
          className={selectBoardClassName("medium", currentBoardSize)}
          onClick={changeBoardSize.bind(null, "medium")}>Size: 70x50</button>
        <button
          className={selectBoardClassName("large", currentBoardSize)}
          onClick={changeBoardSize.bind(null, "large")}>Size: 100x80</button>
      </div>

      <div>
        <div>Sim Speed:</div>
        <button
          className={selectBoardClassName("slow", currentBoardSpeed)}
          onClick={changeBoardSpeed.bind(null, "slow")}>Slow</button>
        <button
          className={selectBoardClassName("medium", currentBoardSpeed)}
          onClick={changeBoardSpeed.bind(null, "medium")}>Medium</button>
        <button
          className={selectBoardClassName("fast", currentBoardSpeed)}
          onClick={changeBoardSpeed.bind(null, "fast")}>Fast</button>
      </div>
    </div>
  );
}