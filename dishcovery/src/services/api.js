import axios from "axios";
/** Cache all canonical ingredients once */
let ALL_INGREDIENTS = null;
export async function getAllIngredients() {
  if (ALL_INGREDIENTS) return ALL_INGREDIENTS;
  const { data } = await axios.get(
    "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
  );
  // Example item: { idIngredient, strIngredient, strDescription, strType }
  ALL_INGREDIENTS = (data?.meals || []).map((x) => x.strIngredient.trim());
  return ALL_INGREDIENTS;
}

/** Expand a fuzzy ingredient term (e.g., "chicken") to all canonical matches */
async function expandIngredientTerm(term) {
  const all = await getAllIngredients();
  const needle = term.trim().toLowerCase();
  // case-insensitive substring match (e.g., "chicken" -> "Chicken", "Chicken Breast", ...)
  const matches = all.filter((ing) => ing.toLowerCase().includes(needle));
  // If nothing matched (rare), fall back to the original term so behavior doesn’t silently drop everything
  return matches.length ? matches : [term];
}

/** Fetch meals that contain a given ingredient */
async function filterByIngredient(ingredient) {
  if (!ingredient) return [];
  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(
    ingredient
  )}`;
  const { data } = await axios.get(url);
  return (data?.meals || []).map((m) => ({
    id: m.idMeal,
    title: m.strMeal,
    image: m.strMealThumb,
  }));
}

/** Intersect multiple meal arrays by ID (AND semantics) */
function intersectById(arrays) {
  if (!arrays.length) return [];
  const idCounts = new Map();
  for (const arr of arrays) {
    for (const r of arr) {
      idCounts.set(r.id, (idCounts.get(r.id) || 0) + 1);
    }
  }
  const needed = arrays.length;
  const first = arrays[0];
  return first.filter((r) => idCounts.get(r.id) === needed);
}
/** Remove duplicate meals by ID */
function dedupeById(list) {
  const seen = new Set();
  const out = [];
  for (const r of list) {
    if (!seen.has(r.id)) {
      seen.add(r.id);
      out.push(r);
    }
  }
  return out;
}

/** Fetch meals belonging to a given category */
export async function filterByCategory(category) {
  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(
    category
  )}`;
  const { data } = await axios.get(url);
  return (data?.meals || []).map((m) => ({
    id: m.idMeal,
    title: m.strMeal,
    image: m.strMealThumb,
  }));
}
export async function getCategories() {
  const { data } = await axios.get(
    "https://www.themealdb.com/api/json/v1/1/list.php?c=list"
  );
  return (data?.meals || []).map((c) => c.strCategory);
}
/**
 * Search recipes by ingredients (AND). Now with fuzzy ingredient expansion.
 * - For each input term, expand to all canonical ingredient names containing the term
 * - Union results per term
 * - Intersect across terms for AND semantics
 */
export async function searchRecipes({
  ingredients = [],
  diet,
  intolerances = [],
  includeCategoryFallback = true, // optional helper for things like "chicken"
}) {
  const cleaned = ingredients.map((s) => s.trim()).filter(Boolean);

  // No ingredients -> browse all (unchanged)
  if (cleaned.length === 0) {
    const { data } = await axios.get(
      "https://www.themealdb.com/api/json/v1/1/search.php?s="
    );
    const meals = data?.meals || [];
    return meals.map((m) => ({
      id: m.idMeal,
      title: m.strMeal,
      image: m.strMealThumb,
    }));
  }

  // For each term: expand -> filter each -> union -> collect
  const perTermUnions = [];
  for (const term of cleaned) {
    const expanded = await expandIngredientTerm(term); // e.g., ["Chicken", "Chicken Breast", "Chicken Thighs", ...]
    const lists = await Promise.all(expanded.map(filterByIngredient));
    let union = dedupeById(lists.flat());

    // Optional extra recall for very common terms (e.g., "chicken")
    if (includeCategoryFallback && term.toLowerCase() === "chicken") {
      const cat = await filterByCategory("Chicken");
      union = dedupeById(union.concat(cat));
    }

    perTermUnions.push(union);
  }

  // AND semantics across terms
  const intersected = intersectById(perTermUnions);

  // (Optional) you could pull details here to apply diet/intolerances heuristics

  return intersected;
}

export async function getRecipeById(id) {
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(
    id
  )}`;
  const { data } = await axios.get(url);
  console.log(data);
  const meal = data?.meals?.[0];
  if (!meal) return null;

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const meas = meal[`strMeasure${i}`];
    if (ing && ing.trim()) {
      ingredients.push({
        ingredient: ing.trim(),
        measure: (meas || "").trim(),
      });
    }
  }

  return {
    id: meal.idMeal,
    title: meal.strMeal,
    image: meal.strMealThumb,
    category: meal.strCategory,
    area: meal.strArea,
    tags: meal.strTags ? meal.strTags.split(",").map((t) => t.trim()) : [],
    instructions: meal.strInstructions,
    youtube: meal.strYoutube,
    source: meal.strSource,
    ingredients,
  };
}
