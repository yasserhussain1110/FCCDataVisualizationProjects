var Preview = ({inputText}) => {
  return (
    <div className="preview" dangerouslySetInnerHTML={{__html : marked(inputText, {sanitize: true})}} />
  );
};


var Editor = ({inputText, changeInputText}) => {
  return (
    <div className="editor">
        <textarea value={inputText} onChange={ (event) => changeInputText(event.target.value) }>
        </textarea>
    </div>
  );
}

class App extends React.Component {

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