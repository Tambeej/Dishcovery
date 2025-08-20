import React, { useState } from "react";
import { inject, observer } from "mobx-react";

function Search() {
  const handleSearch = async () => {
    const params = {
      ingredients: ingredients.join(","),
      diet: diet || userStore.mealPreferences,
      allergies: userStore.allergies,
    };
    await recipeStore.fetchRecipes(params);
  };

  return (
    <div>
      <h2>Search Recipes</h2>
      <IngredientInput />
      <FilterSelect />
      <button onClick={handleSearch}>Search</button>
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
