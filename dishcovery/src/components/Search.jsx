import React, { useState } from "react";
import { inject, observer } from "mobx-react";
import IngredientInput from "./IngredientInput";
import CategoryInput from "./CategoryInput";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import CountryInput from "./CountryInput";
import DishNameInput from "./DishNameInput";

function Search({ recipeStore }) {
  const [ingredients, setIngredients] = useState([]);
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [dishName, setDishName] = useState("");
  const handleSearch = async () => {
    const params = {
      ingredients: ingredients.join(","),
      category: category.join(","),
      country: country.join(","),
      dishName: dishName.join(","),
      diet: diet || userStore.mealPreferences,
      allergies: userStore.allergies,
    };
    await recipeStore.fetchRecipes(params);
  };

  return (
    <div id="search" className="container-fluid ">
      <div className="container text-center my-5 flex-wrap">
        <h2>Search Recipes</h2>
        <IngredientInput onChange={setIngredients} />
        <CategoryInput onChange={setCategory} />
        <CountryInput onChange={setCountry} />
        <DishNameInput onChange={setDishName} />
        <button onClick={handleSearch}> Find → </button>
        {recipeStore.loading && <LoadingSpinner />}
        {recipeStore.error && <ErrorMessage message={recipeStore.error} />}
        {/* <div>
        {recipeStore.searchResults.map((recipe) => (
          <RecipeCard key={recipe.idMeal} recipe={recipe} />
        ))}
      </div> */}
      </div>
    </div>
  );
}

export default inject("recipeStore", "userStore")(observer(Search));
