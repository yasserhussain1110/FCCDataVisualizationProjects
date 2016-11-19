import React, {Component} from 'react';

export default ({generation}) => (
  <div className="control-panel">
    <button>Run</button>
    <button>Pause</button>
    <button>Clear</button>
    <div className="counter">Generation: <span>11</span></div>
  </div>
);