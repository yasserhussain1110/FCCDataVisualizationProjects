import React from 'react';
import marked from 'marked';

export default ({inputText}) => {
  return (
    <div className="preview" dangerouslySetInnerHTML={{__html : marked(inputText, {sanitize: true})}} />
  );
};
