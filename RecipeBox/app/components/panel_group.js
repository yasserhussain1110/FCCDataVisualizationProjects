import React from 'react';
import RecipePanel from './recipe_panel';

export default ({recipes, changeSelection, removeRecipe}) => {
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