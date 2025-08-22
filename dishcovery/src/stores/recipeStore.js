import { makeAutoObservable, runInAction } from "mobx";
import {
  getAllCountries,
  getAllMeals,
  filterByCategory,
  dedupeById,
  filterByIngredient,
  getCategories,
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
  meals = [];
  names = [];
  recipes = []

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
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
            const { data } = await filterByIngredient(ing);
            return (data?.meals || []).map((meal) => ({
              id: meal.idMeal,
              title: meal.strMeal,
              image: meal.strMealThumb,
              category: meal.strCategory,
              area: meal.strArea,
              tags: meal.strTags
                ? meal.strTags.split(",").map((t) => t.trim())
                : [],
              instructions: meal.strInstructions,
              youtube: meal.strYoutube,
              source: meal.strSource,
              ingredients,
            }));
          })
        );
        resultsPerFilter.push(dedupeById(lists.flat()));
      }

      // --- Categories ---
      if (categories.length > 0) {
        const lists = await Promise.all(
          categories.map(async (cat) => {
            const { data } = await filterByCategory(cat);
            return (data?.meals || []).map((meal) => ({
              id: meal.idMeal,
              title: meal.strMeal,
              image: meal.strMealThumb,
              category: meal.strCategory,
              area: meal.strArea,
              tags: meal.strTags
                ? meal.strTags.split(",").map((t) => t.trim())
                : [],
              instructions: meal.strInstructions,
              youtube: meal.strYoutube,
              source: meal.strSource,
              ingredients,
            }));
          })
        );
        resultsPerFilter.push(dedupeById(lists.flat()));
      }

      // --- Countries / Areas ---
      if (countries.length > 0) {
        const lists = await Promise.all(
          countries.map(async (area) => {
            const { data } = await filterByCountry(area);
            return (data?.meals || []).map((m) => ({
              id: meal.idMeal,
              title: meal.strMeal,
              image: meal.strMealThumb,
              category: meal.strCategory,
              area: meal.strArea,
              tags: meal.strTags
                ? meal.strTags.split(",").map((t) => t.trim())
                : [],
              instructions: meal.strInstructions,
              youtube: meal.strYoutube,
              source: meal.strSource,
              ingredients,
            }));
          })
        );
        resultsPerFilter.push(this.dedupeById(lists.flat()));
      }

      // --- Dish names (substring match) ---
      if (dishNames.length > 0) {
        const lists = await Promise.all(
          dishNames.map(async (name) => {
            const { data } = await filterByName(name);
            return (data?.meals || []).map((m) => ({
              id: meal.idMeal,
              title: meal.strMeal,
              image: meal.strMealThumb,
              category: meal.strCategory,
              area: meal.strArea,
              tags: meal.strTags
                ? meal.strTags.split(",").map((t) => t.trim())
                : [],
              instructions: meal.strInstructions,
              youtube: meal.strYoutube,
              source: meal.strSource,
              ingredients,
            }));
          })
        );
        resultsPerFilter.push(this.dedupeById(lists.flat()));
      }

      let finalResults = [];

      if (resultsPerFilter.length === 0) {
        // Default: return all
        const { data } = await axios.get(
          "https://www.themealdb.com/api/json/v1/1/search.php?s="
        );
        finalResults = (data?.meals || []).map((m) => ({
          id: m.idMeal,
          title: m.strMeal,
          image: m.strMealThumb,
        }));
      } else {
        // Intersect results (AND semantics)
        finalResults = this.intersectById(resultsPerFilter);
      }

      runInAction(() => {
        this.recipes = finalResults;
        this.loading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.message;
        this.loading = false;
      });
    }
  }
}

export default new RecipeStore();
