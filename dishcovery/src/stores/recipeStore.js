import { makeAutoObservable, runInAction } from "mobx";
import {
  searchRecipes,
  getRecipeById,
  getAllIngredients,
} from "../services/api";

class RecipeStore {
  searchResults = [];
  ingredientList = [];
  currentRecipe = null;
  loading = false;
  error = null;
  categories = [];
  areas = [];
  randomRecipe = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  //Search recipes
  async fetchRecipes(params) {
    runInAction(() => {
      this.loading = true;
      this.error = null;
    });

    try {
      const results = await searchRecipes(params);
      runInAction(() => {
        this.searchResults = results;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.message;
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
  //Get recipe details
  async fetchRecipeDetails(id) {
    runInAction(() => {
      this.loading = true;
      this.error = null;
    });

    try {
      const recipe = await getRecipeById(id);
      runInAction(() => {
        this.currentRecipe = recipe;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.message;
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  //Get all ingredients
  async getAllIngredients() {
    runInAction(() => {
      this.loading = true;
      this.error = null;
    });

    try {
      const ingredientList = await getAllIngredients();
      runInAction(() => {
        this.ingredientList = ingredientList;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.message;
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}

export default new RecipeStore();
