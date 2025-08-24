const PREFS_KEY = "dishcovery_prefs_v1";
const FAVS_KEY = "dishcovery_favs_v1";

/** Preferences (guest) */
export function getPrefs() {
  try {
    return JSON.parse(localStorage.getItem(PREFS_KEY) || "null");
  } catch {
    return null;
  }
}

export function savePrefs(pref) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(pref || {}));
}

/** Favorites (guest) */
export function getFavs() {
  try {
    return JSON.parse(localStorage.getItem(FAVS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function toggleFav(recipe) {
  const id = String(recipe.id);
  const title = recipe.title;
  const image_url = recipe.image;

  const list = getFavs();
  const idx = list.findIndex((r) => r.recipe_id === id);

  if (idx >= 0) {
    list.splice(idx, 1);
  } else {
    list.unshift({
      recipe_id: id,
      title,
      image_url,
      created_at: new Date().toISOString(),
    });
  }

  localStorage.setItem(FAVS_KEY, JSON.stringify(list));
  return list;
}
