import React, { useState } from "react";
import { inject, observer } from "mobx-react";

function Search() {


  return (
    <div>
      <h2>Search Recipes</h2>
      <IngredientInput />
      <FilterSelect />
      <button>Search</button>
      {recipeStore.loading && <LoadingSpinner />}
      {recipeStore.error && <ErrorMessage message={recipeStore.error} />}
      <div>
        {recipeStore.searchResults.map((recipe) => (
          <RecipeCard key={recipe.idMeal} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
