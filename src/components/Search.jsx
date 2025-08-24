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
  const [hasSearched, setHasSearched] = useState(false);
  const handleSearch = async () => {
    setHasSearched(true);
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
        </div>
        <button className="btn-main" onClick={handleSearch}>
          {" "}
          Find →{" "}
        </button>

        {recipeStore.loading && <LoadingSpinner />}
        {recipeStore.error && <ErrorMessage message={recipeStore.error} />}

        {hasSearched &&
          (recipeStore.recipes.length > 0 ? (
            <div className="row">
              {recipeStore.recipes.map((recipe) => (
                <div
                  key={recipe.idMeal}
                  className="col-12 col-sm-6 col-lg-4 mb-5 mt-5"
                >
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
          ) : (
            <p>No Results Found</p>
          ))}
      </div>
    </div>
  );
}

export default inject("recipeStore", "userStore")(observer(Search));
