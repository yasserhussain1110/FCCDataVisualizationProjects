import React from 'react';

export default ({recipeName, ingredients, index, changeSelection}) => {
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
            <button type="button" className="btn btn-danger">Delete</button>
            <button data-toggle="modal" data-target="#editRecipeModal" type="button" className="btn btn-default">Edit</button>
          </div>
        </div>
      </div>
    </div>
  );
};