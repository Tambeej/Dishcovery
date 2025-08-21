
import { makeAutoObservable, runInAction } from "mobx";
import { searchRecipes, getRecipeById } from "../services/api";

class RecipeStore {
  searchResults = [];
  currentRecipe = null;
  loading = false;
  error = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

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

  async fetchRecipeDetails(id) {
    runInAction(() => {
      this.loading = true;
      this.error = null;
    });

    try {
      const recipe = await getRecipeById(id);
      console.log(`id :${id}`);
      console.log(recipe);
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
}

export default new RecipeStore();
