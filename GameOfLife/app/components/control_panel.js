import React, {Component} from 'react';

const convertIsPausedToClass = (paused) => (
  paused ? "paused" : ""
);

export default ({generation, paused, onPause, onRun, onClear}) => (
  <div className="control-panel">
    <button onClick={onRun}>Run</button>
    <button onClick={onPause} className={convertIsPausedToClass(paused)}>Pause</button>
    <button onClick={onClear}>Clear</button>
    <div className="counter">Generation: <span>{generation}</span></div>
  </div>
);