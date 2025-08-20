import { makeAutoObservable } from "mobx";

class RecipeStore {
  searchResults = [];
  currentRecipe = null;
  loading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchRecipes(params) {}

  async fetchRecipeDetails(id) {}
}

const recipeStore = new RecipeStore();
export default recipeStore;
