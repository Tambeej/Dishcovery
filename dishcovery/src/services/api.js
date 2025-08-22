// import axios from "axios";

// /**
//  * TheMealDB helpers
//  * - filter.php?i=ingredient returns a list with minimal fields
//  * - lookup.php?i=id returns full recipe with ingredients 1..20
//  */

// async function filterByIngredient(ingredient) {
//   if (!ingredient) return [];
//   const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(
//     ingredient
//   )}`;
//   const { data } = await axios.get(url);
//   return (data?.meals || []).map((m) => ({
//     id: m.idMeal,
//     title: m.strMeal,
//     image: m.strMealThumb,
//   }));
// }

// // Intersect arrays of recipes by id
// function intersectById(arrays) {
//   if (!arrays.length) return [];
//   const idCounts = new Map();
//   for (const arr of arrays) {
//     for (const r of arr) {
//       idCounts.set(r.id, (idCounts.get(r.id) || 0) + 1);
//     }
//   }
//   const needed = arrays.length;
//   const first = arrays[0];
//   return first.filter((r) => idCounts.get(r.id) === needed);
// }

// /**
//  * Search recipes by ingredients (AND). Optional diet/intolerances filters can be
//  * applied at the detail level (client-side heuristic) if you want stricter behavior.
//  */
// export async function searchRecipes({
//   ingredients = [], // array of strings
//   diet, // 'meat' | 'vegetarian' | 'vegan' (heuristic only with TheMealDB)
//   intolerances = [], // ['gluten','peanut',...]
// }) {
//   const cleaned = ingredients.map((s) => s.trim()).filter(Boolean);

//   // No ingredients: basic "browse all" feel using 'search.php?s=' (returns many)
//   if (cleaned.length === 0) {
//     const { data } = await axios.get(
//       "https://www.themealdb.com/api/json/v1/1/search.php?s="
//     );
//     const meals = data?.meals || [];
//     return meals.map((m) => ({
//       id: m.idMeal,
//       title: m.strMeal,
//       image: m.strMealThumb,
//     }));
//   }

//   // Intersect results for each ingredient
//   const lists = await Promise.all(cleaned.map(filterByIngredient));
//   console.log(lists);
//   const intersected = intersectById(lists);

//   // Optionally load details for filtering by intolerances/diet.
//   // Keeping it minimal for speed; you can expand if needed.
//   return intersected;
// }

// export async function getRecipeById(id) {
//   const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(
//     id
//   )}`;
//   const { data } = await axios.get(url);
//   const meal = data?.meals?.[0];
//   if (!meal) return null;

//   // Extract ingredients+measures
//   const ingredients = [];
//   for (let i = 1; i <= 20; i++) {
//     const ing = meal[`strIngredient${i}`];
//     const meas = meal[`strMeasure${i}`];
//     if (ing && ing.trim()) {
//       ingredients.push({
//         ingredient: ing.trim(),
//         measure: (meas || "").trim(),
//       });
//     }
//   }

//   return {
//     id: meal.idMeal,
//     title: meal.strMeal,
//     image: meal.strMealThumb,
//     category: meal.strCategory,
//     area: meal.strArea,
//     tags: meal.strTags ? meal.strTags.split(",").map((t) => t.trim()) : [],
//     instructions: meal.strInstructions,
//     youtube: meal.strYoutube,
//     source: meal.strSource,
//     ingredients,
//   };
// }

import axios from "axios";

/** Get (almost) all meals by sweeping categories (and optionally areas) */
export async function getAllMeals({ includeAreas = false } = {}) {
  const seen = new Set();
  const out = [];

  // 1) Sweep by CATEGORY
  const { data: catsData } = await axios.get(
    "https://www.themealdb.com/api/json/v1/1/list.php?c=list"
  );
  const categories = (catsData?.meals || [])
    .map((c) => c.strCategory)
    .filter(Boolean);

  for (const c of categories) {
    try {
      const { data } = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(
          c
        )}`
      );
      for (const m of data?.meals || []) {
        if (!seen.has(m.idMeal)) {
          seen.add(m.idMeal);
          out.push({ id: m.idMeal, title: m.strMeal, image: m.strMealThumb });
        }
      }
    } catch {
      /* skip a failing category */
    }
  }

  // 2) (Optional) Sweep by AREA to catch any stragglers not exposed via categories
  if (includeAreas) {
    const { data: areasData } = await axios.get(
      "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
    );
    const areas = (areasData?.meals || [])
      .map((a) => a.strArea)
      .filter(Boolean);

    for (const a of areas) {
      try {
        const { data } = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(
            a
          )}`
        );
        for (const m of data?.meals || []) {
          if (!seen.has(m.idMeal)) {
            seen.add(m.idMeal);
            out.push({ id: m.idMeal, title: m.strMeal, image: m.strMealThumb });
          }
        }
      } catch {
        /* skip a failing area */
      }
    }
  }

  return out;
}

/** Filter meals by "country"/area (TheMealDB calls it Area). */
export async function filterByCountry(country) {
  if (!country) return [];

  // Normalize input → Title Case to match API Areas (e.g., "American", "British")
  const norm = String(country).trim().toLowerCase();

  // Common synonyms mapping (extend as needed)
  const AREA_SYNONYMS = {
    usa: "American",
    "united states": "American",
    american: "American",
    us: "American",
    uk: "British",
    england: "British",
    british: "British",
    uae: "Unknown", // no specific UAE area in API; "Unknown" exists
    korea: "Unknown", // API has "Unknown" but no split KR
    scotland: "British",
  };

  const titleCase = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const area =
    AREA_SYNONYMS[norm] ||
    // e.g., "italian", "mexican", "french" should work if capitalized
    titleCase(norm);

  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(
    area
  )}`;

  const { data } = await axios.get(url);

  // If nothing returned and we mapped to a synonym, optionally try the raw Title Case
  let meals = data?.meals || [];
  if (!meals.length && AREA_SYNONYMS[norm]) {
    const fallbackUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(
      titleCase(norm)
    )}`;
    const { data: d2 } = await axios.get(fallbackUrl);
    meals = d2?.meals || [];
  }

  return meals.map((m) => ({
    id: m.idMeal,
    title: m.strMeal,
    image: m.strMealThumb,
  }));
}
/** Get all available countries/areas from TheMealDB */
export async function getAllCountries() {
  const { data } = await axios.get(
    "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
  );
  return (data?.meals || []).map((x) => x.strArea).filter(Boolean);
}

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

/** Your existing helper (unchanged) */
export async function filterByIngredient(ingredient) {
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

export function dedupeById(list) {
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

/** Optional: category fallback for common terms like "chicken" */
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
