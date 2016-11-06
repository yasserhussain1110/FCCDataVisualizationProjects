import './style.scss';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Editor from './components/editor';
import Preview from './components/preview';


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {inputText: "Heading\n=======\n\nSub-heading\n-----------\n \n### Another deeper heading\n \nParagraphs are separated\nby a blank line.\n\nLeave 2 spaces at the end of a line to do a  \nline break\n\nText attributes *italic*, **bold**, \n`monospace`, ~~strikethrough~~ .\n\nShopping list:\n\n  * apples\n  * oranges\n  * pears\n\nNumbered list:\n\n  1. apples\n  2. oranges\n  3. pears\n\nThe rain---not the reign---in\nSpain.\n\n *[Herman Fassett](https:\/\/freecodecamp.com\/hermanfassett)*"};
  }

  render() {
    return (
      <div className="container">
        <Editor
          changeInputText={(newText) => this.setState({inputText: newText})}
          inputText={this.state.inputText}/>

        <Preview inputText={this.state.inputText}/>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.querySelector(".parent"));
