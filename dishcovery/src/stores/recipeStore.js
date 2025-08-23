import { makeAutoObservable, runInAction } from "mobx";
import {
  filterByCountry,
  getAllCountries,
  getAllMeals,
  filterByCategory,
  filterByIngredient,
  getCategories,
  searchRecipes,
  getRecipeById,
  getAllIngredients,
  dedupeById,
  intersectById,
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
  meals = [];
  names = [];
  recipes = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  filterDishByName(name) {
    if (!name || !this.meals) return null;

    return this.meals.find(
      (meal) => meal.title.toLowerCase() === name.toLowerCase()
    );
  }

  async getAllMealNames() {
    this.loading = true;
    try {
      const data = await getAllMeals();

      runInAction(() => {
        this.meals = data || [];
        this.names = this.meals.map((m) => m.title);
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

  // //Search recipes
  // async fetchRecipes(params) {
  //   runInAction(() => {
  //     this.loading = true;
  //     this.error = null;
  //   });

  //   try {
  //     const results = await searchRecipes(params);
  //     runInAction(() => {
  //       this.searchResults = results;
  //     });
  //   } catch (err) {
  //     runInAction(() => {
  //       this.error = err.message;
  //     });
  //   } finally {
  //     runInAction(() => {
  //       this.loading = false;
  //     });
  //   }
  // }
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
      const result = await getAllCountries();
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
  async fetchRecipes({
    ingredients = [],
    categories = [],
    countries = [],
    dishNames = [],
  }) {
    this.loading = true;
    this.error = null;

    try {
      const resultsPerFilter = [];

      if (ingredients.length > 0) {
        const lists = await Promise.all(
          ingredients.map(async (ing) => {
            const meals = await filterByIngredient(ing);
            return meals;
          })
        );
        resultsPerFilter.push(dedupeById(lists.flat()));
      }

      // --- Categories ---
      if (categories.length > 0) {
        const lists = await Promise.all(
          categories.map(async (cat) => {
            const meals = await filterByCategory(cat);
            return meals;
          })
        );
        resultsPerFilter.push(dedupeById(lists.flat()));
      }

      // --- Countries / Areas ---
      if (countries.length > 0) {
        const lists = await Promise.all(
          countries.map(async (area) => {
            const meals = await filterByCountry(area);
            return meals;
          })
        );
        resultsPerFilter.push(dedupeById(lists.flat()));
      }

      // --- Dish names (substring match) ---
      if (dishNames.length > 0) {
        const lists = await Promise.all(
          dishNames.map(async (name) => {
            const meals = await this.filterDishByName(name);
            return meals;
          })
        );
        resultsPerFilter.push(dedupeById(lists.flat()));
      }

      let finalResults = [];

      if (resultsPerFilter.length === 0) {
        const meals = await getAllMeals();
        finalResults = meals;
      } else {
        finalResults = intersectById(resultsPerFilter);
        console.log(finalResults);
      }

      runInAction(() => {
        this.recipes = finalResults.slice(0, 9);
        this.loading = false;
      });
      console.log(finalResults);
    } catch (err) {
      runInAction(() => {
        this.error = err.message;
        this.loading = false;
      });
    }
  }
}

export default new RecipeStore();
