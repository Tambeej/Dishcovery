// stores/ingredientStore.js
import { makeAutoObservable, runInAction } from "mobx";
import {
  getAllIngredients,
  filterByIngredient,
} from "../services/api";

class IngredientStore {
  allIngredients = [];
  randomIngredients = [];
  selectedIngredient = null;
  ingredientRecipes = [];
  loading = false;
  error = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async fetchAllIngredients() {
    this._withLoading(async () => {
      const ingredients = await getAllIngredients();
      runInAction(() => {
        this.allIngredients = ingredients;
      });
      this.pickRandomIngredients(); // preload first 5
    });
  }

  pickRandomIngredients() {
    if (!this.allIngredients.length) return;
    const shuffled = [...this.allIngredients].sort(() => 0.5 - Math.random());
    runInAction(() => {
      this.randomIngredients = shuffled.slice(0, 5);
    });
  }

  async fetchRecipesByIngredient(ingredient) {
    this._withLoading(async () => {
      const recipes = await filterByIngredient(ingredient);
      runInAction(() => {
        this.selectedIngredient = ingredient;
        this.ingredientRecipes = recipes;
      });
    });
  }

  // helper
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

export default new IngredientStore();
