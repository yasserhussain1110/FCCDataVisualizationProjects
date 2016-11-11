import './style.scss';

import ReactDOM from 'react-dom';
import React, {Component} from 'react';
import NewRecipeModal from './components/new_recipe_modal';
import EditRecipeModal from './components/edit_recipe_modal';
import PanelGroup from './components/panel_group';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentSelected : 0,
      recipes: [
        {
          name: "Banato",
          ingredients: ["Tomato", "Banana"]
        },

        {
          name: "Curry",
          ingredients: ["Water", "Spice"]
        }
      ]
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
