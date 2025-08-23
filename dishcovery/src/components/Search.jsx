import React, { useState } from "react";
import { inject, observer } from "mobx-react";
import IngredientInput from "./IngredientInput";
import CategoryInput from "./CategoryInput";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import CountryInput from "./CountryInput";
import DishNameInput from "./DishNameInput";
import RecipeCard from "./RecipeCard";

function Search({ recipeStore }) {
  const [ingredients, setIngredients] = useState([]);
  const [category, setCategory] = useState([]);
  const [country, setCountry] = useState([]);
  const [dishName, setDishName] = useState([]);
  const handleSearch = async () => {
    const params = {
      ingredients: ingredients,
      categories: category,
      countries: country,
      dishNames: dishName,
      // diet: diet || userStore.mealPreferences,
      // allergies: userStore.allergies,
    };
    await recipeStore.fetchRecipes(params);
  };

  return (
    <div id="search" className="container-fluid ">
      <div className="container text-center my-5 flex-wrap">
        <h2>Search Recipes</h2>
        <div className="d-flex flex-wrap justify-content-center gap-2 mb-3">
          <IngredientInput onChange={setIngredients} />
          <CategoryInput onChange={setCategory} />
          <CountryInput onChange={setCountry} />
          <DishNameInput onChange={setDishName} />
          <button onClick={handleSearch}> Find → </button>
        </div>
        {recipeStore.loading && <LoadingSpinner />}
        {recipeStore.error && <ErrorMessage message={recipeStore.error} />}

        <div className="row">
          {recipeStore.recipes.map((recipe) => (
            <div
              key={recipe.idMeal}
              className="d-flex flex-wrap justify-content-centercol-12 col-md-3 mb-4"
            >
              <RecipeCard recipe={recipe} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default inject("recipeStore", "userStore")(observer(Search));
