import React from 'react';
import RecipePanel from './recipe_panel';

export default ({recipes, changeSelection}) => {
  const recipePanels = recipes.map(function(recipe, index){
    return (
      <RecipePanel key={index}
                   recipeName={recipe.name}
                   ingredients={recipe.ingredients}
                   index={index}
                   changeSelection={changeSelection}/>
    );
  });

  return (
    <div role="tablist" className="panel-group" id="accordion">
      {recipePanels}
    </div>
  );
}