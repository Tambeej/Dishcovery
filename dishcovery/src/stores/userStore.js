import { makeAutoObservable, runInAction } from "mobx";
import {
  getMyProfile,
  getMyPreferences,
  upsertPreferences,
  listFavorites,
  toggleFavorite,
} from "../services/db";


class UserStore {
  profile = null;
  preferences = null;
  favorites = [];
  loading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  /** Load everything for logged-in user */
  async loadUserData() {
    this.loading = true;
    this.error = null;
    try {
      const [profile, preferences, favorites] = await Promise.all([
        getMyProfile(),
        getMyPreferences(),
        listFavorites(),
      ]);
      runInAction(() => {
        this.profile = profile;
        this.preferences = preferences;
        this.favorites = favorites;
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

  /** Preferences */
  async savePreferences(pref) {
    try {
      const updated = await upsertPreferences(pref);
      runInAction(() => {
        this.preferences = updated;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.message;
      });
    }
  }

  /** Favorites */
  async toggleFavorite(recipe) {
    try {
      const res = await toggleFavorite(recipe);
      runInAction(() => {
        if (res.added) {
          this.favorites.unshift({
            recipe_id: String(recipe.id),
            title: recipe.title,
            image_url: recipe.image,
          });
        } else if (res.removed) {
          this.favorites = this.favorites.filter(
            (f) => f.recipe_id !== String(recipe.id)
          );
        }
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.message;
      });
    }
  }

  isFavorite(recipeId) {
    return this.favorites.some((f) => f.recipe_id === String(recipeId));
  }
}

export default new UserStore();





