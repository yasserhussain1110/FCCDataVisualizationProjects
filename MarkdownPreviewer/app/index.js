import React from 'react';
import ReactDOM from 'react-dom';
import Editor from './components/editor';


const main = <div>
  <Editor />
  <div className="a">a</div>
</div>;

ReactDOM.render(main, document.querySelector(".container"));
