import './style.css';
import React from 'react';
import ReactDOM from 'react-dom';
import Editor from './components/editor';
import Preview from './components/preview';


const main = <div className="container">
  <Editor />
  <Preview />
</div>;

ReactDOM.render(main, document.querySelector(".parent"));
