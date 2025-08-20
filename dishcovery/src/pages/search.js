import React, { useState } from "react";
import { inject, observer } from "mobx-react";

function Search() {
  const [ingredients, setIngredients] = useState([]);
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [dishName, setDishName] = useState("");
  const handleSearch = async () => {
    const params = {
      ingredients: ingredients.join(","),
      category: category,
      country: country,
      dishName: dishName,
      diet: diet || userStore.mealPreferences,
      allergies: userStore.allergies,
    };
    await recipeStore.fetchRecipes(params);
  };

  return (
    <div>
      <h2>Search Recipes</h2>
      <IngredientInput onChange={setIngredients} />
      <CategoryInput onChange={setCategory} />
      <CountryInput onChange={setCountry} />
      <DishNameInput onChange={setDishName} />
      <button onClick={handleSearch}>Find</button>
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

export default inject("recipeStore","userStore")(observer(Search));
