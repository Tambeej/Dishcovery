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
  getRandomMeals,
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
  randomMeals = [];

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

  //Get recipe details
  async getRecipeDetails(id) {
    runInAction(() => {
      this.loading = true;
      this.error = null;
    });

    try {
      const recipe = await getRecipeById(id);
      runInAction(() => {
        return recipe;
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

  // async fetchRecipes({
  //   ingredients = [],
  //   categories = [],
  //   countries = [],
  //   dishNames = [],
  //   diet = "",
  //   allergies = [],
  // }) {
  //   this.loading = true;
  //   this.error = null;

  //   try {
  //     // Start with all meals
  //     let allMeals = await getAllMeals();

  //     // Fetch full recipe details for diet and allergen filtering
  //     const detailedMeals = await Promise.all(
  //       allMeals.map(async (meal) => {
  //         const recipe = await this.getRecipeDetails(meal.id);
  //         return recipe;
  //       })
  //     ).then((results) => results.filter((meal) => meal !== null));

  //     // Apply diet filtering if provided
  //     if (diet) {
  //       allMeals = detailedMeals
  //         .filter((recipe) => {
  //           if (diet === "vegetarian")
  //             return recipe.strCategory.toLowerCase() === "vegetarian";
  //           if (diet === "vegan")
  //             return recipe.strCategory.toLowerCase() === "vegan";
  //           if (diet === "meat")
  //             return ["beef", "chicken", "pork", "lamb"].includes(
  //               recipe.strCategory.toLowerCase()
  //             );
  //           return false; // Exclude if diet doesn't match
  //         })
  //         .map((meal) => ({
  //           id: meal.idMeal,
  //           title: meal.strMeal,
  //           image: meal.strMealThumb,
  //         }));
  //     }

  //     // Apply allergen filtering if provided
  //     if (allergies.length) {
  //       const allergenMap = getAllergenMap();
  //       allMeals = detailedMeals
  //         .filter((recipe) => {
  //           const recipeIngredients = Object.keys(recipe)
  //             .filter((key) => key.startsWith("strIngredient") && recipe[key])
  //             .map((key) => recipe[key].toLowerCase());
  //           return !allergies.some((allergen) => {
  //             const allergenIngredients =
  //               allergenMap[allergen.toLowerCase()] || [];
  //             return allergenIngredients.some((ing) =>
  //               recipeIngredients.includes(ing)
  //             );
  //           });
  //         })
  //         .map((meal) => ({
  //           id: meal.idMeal,
  //           title: meal.strMeal,
  //           image: meal.strMealThumb,
  //         }));
  //     }

  //     const resultsPerFilter = [];

  //     // Filter by ingredients
  //     if (ingredients.length > 0) {
  //       const lists = await Promise.all(
  //         ingredients.map(async (ing) => {
  //           const meals = await filterByIngredient(ing);
  //           return meals.filter((meal) =>
  //             allMeals.some((m) => m.id === meal.id)
  //           );
  //         })
  //       );
  //       const validList = dedupeById(lists.flat());
  //       if (validList.length > 0) resultsPerFilter.push(validList);
  //     }

  //     // Filter by categories
  //     if (categories.length > 0) {
  //       const lists = await Promise.all(
  //         categories.map(async (cat) => {
  //           const meals = await filterByCategory(cat);
  //           return meals.filter((meal) =>
  //             allMeals.some((m) => m.id === meal.id)
  //           );
  //         })
  //       );
  //       const validList = dedupeById(lists.flat());
  //       if (validList.length > 0) resultsPerFilter.push(validList);
  //     }

  //     // Filter by countries
  //     if (countries.length > 0) {
  //       const lists = await Promise.all(
  //         countries.map(async (area) => {
  //           const meals = await filterByCountry(area);
  //           return meals.filter((meal) =>
  //             allMeals.some((m) => m.id === meal.id)
  //           );
  //         })
  //       );
  //       const validList = dedupeById(lists.flat());
  //       if (validList.length > 0) resultsPerFilter.push(validList);
  //     }

  //     // Filter by dish names
  //     if (dishNames.length > 0) {
  //       const lists = dishNames
  //         .map((name) => this.filterDishByName(name))
  //         .filter((meal) => meal && allMeals.some((m) => m.id === meal.id));
  //       const validList = dedupeById(lists);
  //       if (validList.length > 0) resultsPerFilter.push(validList);
  //     }

  //     let finalResults = [];

  //     if (resultsPerFilter.length === 0) {
  //       finalResults = allMeals; // Use diet/allergen-filtered meals if no other filters
  //     } else {
  //       finalResults = intersectById(resultsPerFilter);
  //     }

  //     runInAction(() => {
  //       this.recipes = finalResults.slice(0, 9);
  //     });
  //   } catch (err) {
  //     runInAction(() => {
  //       this.error = err.message || "Failed to fetch recipes";
  //     });
  //   } finally {
  //     runInAction(() => {
  //       this.loading = false;
  //     });
  //   }
  // }


  
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
  async fetchRandomMeals(count = 5) {
    this._withLoading(async () => {
      const result = await getRandomMeals(count);
      runInAction(() => {
        this.randomMeals = result;
      });
    });
  }
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
