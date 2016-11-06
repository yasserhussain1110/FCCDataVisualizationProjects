import React, {Component} from 'react';

export default ({inputText, changeInputText}) => {
  return (
    <div className="editor">
        <textarea value={inputText} onChange={ (event) => changeInputText(event.target.value) }>
        </textarea>
    </div>
  );
}