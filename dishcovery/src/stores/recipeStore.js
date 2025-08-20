import { makeAutoObservable } from "mobx";
import { searchRecipes, getRecipeById} from "../services/api";

class RecipeStore {
  searchResults = [];
  currentRecipe = null;
  loading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchRecipes(params) {
    this.loading = true;
    this.error = null;
    try {
      this.searchResults = await searchRecipes(params);
    } catch (err) {
      this.error = err.message;
    }
    this.loading = false;

  }

  async fetchRecipeDetails(id) {
    this.loading = true;
    this.error = null;
    try {
      this.currentRecipe = await getRecipeById(id);
    } catch (err) {
      this.error = err.message;
    }
    this.loading = false;
  
  }
}

const recipeStore = new RecipeStore();
export default recipeStore;
