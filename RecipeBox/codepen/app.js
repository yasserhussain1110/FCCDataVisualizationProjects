
const RecipePanel = ({recipeName, ingredients, index, changeSelection, removeRecipe}) => {
  const ingredientList = ingredients.map(function (ingredient, index) {
    return (
      <li key={index} className="list-group-item">{ingredient}</li>
    );
  });

  return (
    <div className="panel panel-success">
      <div className="panel-heading">
        <h3 onClick={() => changeSelection(index)} className="panel-title">
          <a data-parent="#accordion" data-toggle="collapse" href={`#collapse${index}`}>{recipeName}</a>
        </h3>
      </div>
      <div id={`collapse${index}`} className="panel-collapse collapse ">
        <div className="panel-body">
          <h4 className="text-center">Ingredients</h4>
          <ul className="list-group">
            {ingredientList}
          </ul>
          <div role="toolbar" className="btn-toolbar">
            <button type="button" onClick={removeRecipe} className="btn btn-danger">Delete</button>
            <button data-toggle="modal" data-target="#editRecipeModal" type="button" className="btn btn-default">Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PanelGroup = ({recipes, changeSelection, removeRecipe}) => {
  const recipePanels = recipes.map(function (recipe, index) {
    return (
      <RecipePanel key={index}
                   recipeName={recipe.name}
                   ingredients={recipe.ingredients}
                   index={index}
                   removeRecipe={removeRecipe}
                   changeSelection={changeSelection}/>
    );
  });

  return (
    <div role="tablist" className="panel-group" id="accordion">
      {recipePanels}
    </div>
  );
};

class NewRecipeModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {recipeName: "", ingredients: ""};
  }

  render() {
    return (
      <div id="newRecipeModal" className="modal fade" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">&times;</button>
              <h4 className="modal-title">Add a Recipe</h4>
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
                      onClick={() => this.props.addRecipe(this.state.recipeName, this.state.ingredients.split(","))}
                      className="btn btn-primary" data-dismiss="modal">Add Recipe
              </button>
              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}




class EditRecipeModal extends React.Component {

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
                      className="btn btn-primary" data-dismiss="modal">Edit Recipe
              </button>
              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}




class App extends React.Component {
  constructor(props) {
    super(props);


    var recipes = (typeof localStorage["recipes"] != "undefined") ? JSON.parse(localStorage["recipes"]) :
      [
        {
          name: "Banato",
          ingredients: ["Tomato", "Banana"]
        },

        {
          name: "Curry",
          ingredients: ["Water", "Spice"]
        }
      ];

    this.state = {
      currentSelected: 0,
      recipes: recipes
    };
  }

  addRecipes(name, ingredients) {
    var recipes = this.state.recipes;
    recipes.push({name, ingredients});

    return recipes;
  }

  modifyCurrentRecipe(name, ingredients) {
    var recipes = this.state.recipes;
    recipes[this.state.currentSelected] = {name, ingredients};
    return recipes;
  }

  removeCurrentRecipe() {
    var recipes = this.state.recipes;
    recipes.splice(this.state.currentSelected, 1);
    return recipes;
  }

  updateCurrentSelection(currentSelected) {
    this.setState({currentSelected: currentSelected});

    this.refs.editRecipeModal.setState({
      recipeName: this.state.recipes[currentSelected].name,
      ingredients: this.state.recipes[currentSelected].ingredients,
    });
  }

  render() {

    localStorage.setItem("recipes", JSON.stringify(this.state.recipes));

    return (
      <div className="container">
        <div className="well">
          <PanelGroup
            recipes={this.state.recipes}
            changeSelection={currentSelected => this.updateCurrentSelection(currentSelected)}
            removeRecipe={index => this.setState({recipes: this.removeCurrentRecipe()})}
          />
        </div>

        <div>
          <button type="button"
                  data-toggle="modal"
                  data-target="#newRecipeModal" className="btn btn-lg btn-primary">Add Recipe
          </button>
        </div>

        <NewRecipeModal addRecipe={(name, ingredients) => {
          this.setState({recipes: this.addRecipes(name, ingredients)})
        }}/>
        <EditRecipeModal
          ref="editRecipeModal"
          changeRecipe={(name, ingredients) => {
            this.setState({recipes: this.modifyCurrentRecipe(name, ingredients)})
          }}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('.parent'));