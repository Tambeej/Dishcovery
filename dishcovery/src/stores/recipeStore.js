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

  // Get recipes by ingredient
  async fetchRecipesByIngredient(ingredient) {
    this._withLoading(async () => {
      const results = await getRecipesByIngredient(ingredient);
      runInAction(() => {
        this.searchResults = results;
      });
    });
  }

  // Get random recipe
  async fetchRandomRecipe() {
    this._withLoading(async () => {
      const recipe = await getRandomRecipe();
      runInAction(() => {
        this.randomRecipe = recipe;
      });
    });
  }

  // Get categories
  async fetchCategories() {
    this._withLoading(async () => {
      const cats = await getCategories();
      runInAction(() => {
        this.categories = cats;
      });
    });
  }

  // Get recipes by category
  async fetchRecipesByCategory(category) {
    this._withLoading(async () => {
      const results = await getRecipesByCategory(category);
      runInAction(() => {
        this.searchResults = results;
      });
    });
  }

  // Get areas
  async fetchAreas() {
    this._withLoading(async () => {
      const result = await getAreas();
      runInAction(() => {
        this.areas = result;
      });
    });
  }

  // Get recipes by area
  async fetchRecipesByArea(area) {
    this._withLoading(async () => {
      const results = await getRecipesByArea(area);
      runInAction(() => {
        this.searchResults = results;
      });
    });
  }

  // Helper to reduce duplication
  async _withLoading(fn) {
    runInAction(() => {
      this.loading = true;
      this.error = null;
    });
    try {
      await fn();
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
