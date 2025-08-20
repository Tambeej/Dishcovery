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

export const userStore = new UserStore();
