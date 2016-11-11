import React, {Component} from 'react';

export default class EditRecipeModal extends Component {

  constructor(props) {
    super(props);

    this.state = {recipeName: "", ingredients: []};
  }

  render() {
    return (
      <div id="editRecipeModal" className="modal fade" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">&times;</button>
              <h4 className="modal-title">Edit Recipe</h4>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="recipe">Recipe</label>
                  <input type="text"
                         onChange={e => this.setState({recipeName: e.target.value})}
                         value={this.state.recipeName}
                         className="form-control" id="recipe" placeholder="Recipe Name"/>
                </div>
                <div className="form-group">
                  <label htmlFor="ingredients">Ingredients</label>
                  <textarea
                    onChange={e => this.setState({ingredients: e.target.value})}
                    value={this.state.ingredients}
                    type="textarea" className="form-control" id="ingredients"
                    placeholder="Enter ingredients,separated by,commas"></textarea>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button"
                      onClick={() => this.props.changeRecipe(this.state.recipeName, this.state.ingredients.split(","))}
                      className="btn btn-primary" data-dismiss="modal">Edit Recipe</button>
              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
