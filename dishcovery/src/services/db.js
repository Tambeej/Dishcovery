import { supabase } from "./supabase";

/** Helper to get current user (throws if not signed in) */
async function requireUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  const user = data?.user;
  if (!user) throw new Error("Not authenticated");
  return user;
}

/** PROFILES */
export async function getMyProfile() {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) throw error;
  return data;
}

/** PREFERENCES (1-1 row with user) */
export async function getMyPreferences() {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) return null;

  const { data, error } = await supabase
    .from("preferences")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function upsertPreferences(pref) {
  const user = await requireUser();
  const payload = {
    user_id: user.id,
    diet: pref.diet,
    intolerances: pref.intolerances || [],
    show_allergens: !!pref.show_allergens,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("preferences")
    .upsert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** FAVORITES (many rows per user) */
export async function listFavorites() {
  const user = await requireUser();
  const { data, error } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function toggleFavorite(recipe) {
  const user = await requireUser();
  const recipeId = String(recipe.id);

  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("recipe_id", recipeId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("id", existing.id);
    if (error) throw error;
    return { removed: true };
  } else {
    const row = {
      user_id: user.id,
      recipe_id: recipeId,
      title: recipe.title,
      image_url: recipe.image,
    };
    const { error } = await supabase.from("favorites").insert(row);
    if (error) throw error;
    return { added: true };
  }
}
