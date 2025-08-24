// import { makeAutoObservable, runInAction } from "mobx";
// import {
//   getMyProfile,
//   getMyPreferences,
//   upsertPreferences,
//   listFavorites,
//   toggleFavorite,
// } from "../services/db";

// class UserStore {
//   profile = null;
//   preferences = null;
//   favorites = [];
//   loading = false;
//   error = null;

//   constructor() {
//     makeAutoObservable(this);
//   }

//   /** Load everything for logged-in user */
//   async loadUserData() {
//     this.loading = true;
//     this.error = null;
//     try {
//       const [profile, preferences, favorites] = await Promise.all([
//         getMyProfile(),
//         getMyPreferences(),
//         listFavorites(),
//       ]);
//       runInAction(() => {
//         this.profile = profile;
//         this.preferences = preferences;
//         this.favorites = favorites;
//       });
//     } catch (err) {
//       runInAction(() => {
//         this.error = err.message;
//       });
//     } finally {
//       runInAction(() => {
//         this.loading = false;
//       });
//     }
//   }

//   /** Preferences */
//   async savePreferences(pref) {
//     try {
//       const updated = await upsertPreferences(pref);
//       runInAction(() => {
//         this.preferences = updated;
//       });
//     } catch (err) {
//       runInAction(() => {
//         this.error = err.message;
//       });
//     }
//   }

//   /** Favorites */
//   async toggleFavorite(recipe) {
//     try {
//       const res = await toggleFavorite(recipe);
//       runInAction(() => {
//         if (res.added) {
//           this.favorites.unshift({
//             recipe_id: String(recipe.id),
//             title: recipe.title,
//             image_url: recipe.image,
//           });
//         } else if (res.removed) {
//           this.favorites = this.favorites.filter(
//             (f) => f.recipe_id !== String(recipe.id)
//           );
//         }
//       });
//     } catch (err) {
//       runInAction(() => {
//         this.error = err.message;
//       });
//     }
//   }

//   isFavorite(recipeId) {
//     return this.favorites.some((f) => f.recipe_id === String(recipeId));
//   }
// }

// export default new UserStore();

import { makeAutoObservable, runInAction } from "mobx";
import {
  getMyProfile,
  getMyPreferences,
  upsertPreferences,
  listFavorites,
  toggleFavorite as toggleFavoriteDb,
} from "../services/db";

const DEFAULT_PREFS = {
  diet: "meat", // 'meat' | 'vegetarian' | 'vegan'
  intolerances: [],
  show_allergens: true,
};

const LS_KEY = "prefs_v1";

function readLocalPrefs() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

function writeLocalPrefs(prefs) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(prefs));
  } catch (_) {}
}

class UserStore {
  authUser = null; // Supabase user or null
  profile = null;
  preferences = { ...DEFAULT_PREFS };
  favorites = [];
  loading = false;
  error = null;
  _signOut = null; // delegate from AuthProvider (optional)

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  // ===== Computeds =====
  get isLoggedIn() {
    console.log(!!this.authUser);
    return !!this.authUser;
  }

  get greeting() {
    if (!this.isLoggedIn) return "Guest";
    const email = this.authUser?.email || "User";
    return email.split("@")[0];
  }

  get favoriteIds() {
    return new Set(this.favorites.map((f) => String(f.recipe_id)));
  }

  // Best-effort display name from profile → user metadata → email → fallback
  get displayName() {
    // If you load a profile row with a name/full_name, prefer that
    const p = this.profile;
    if (p?.name) return p.name;
    if (p?.full_name) return p.full_name;

    // Supabase auth user metadata (from OAuth providers or your app)
    const meta = this.authUser?.user_metadata || {};
    if (meta.name) return meta.name;
    if (meta.full_name) return meta.full_name;
    if (meta.username) return meta.username;

    // Fallback to the email local-part
    const email = this.authUser?.email;
    if (email) return email.split("@")[0];

    // Last-resort fallback
    return "User";
  }

  // ===== Auth wiring =====
  /** Attach current auth to the store (called by AuthBridge). */
  attachAuth({ user, signOut }) {
    this.authUser = user || null;
    this._signOut = typeof signOut === "function" ? signOut : this._signOut;
    this.loadUserData();
  }

  /** Clear user-related state. */
  reset() {
    this.profile = null;
    this.preferences = { ...DEFAULT_PREFS };
    this.favorites = [];
    this.error = null;
  }

  // ===== Data loading =====
  async loadUserData() {
    this.loading = true;
    this.error = null;
    try {
      if (this.isLoggedIn) {
        const [profile, preferences, favorites] = await Promise.all([
          getMyProfile(),
          getMyPreferences(),
          listFavorites(),
        ]);
        runInAction(() => {
          this.profile = profile || null;
          this.preferences = { ...DEFAULT_PREFS, ...(preferences || {}) };
          this.favorites = favorites || [];
        });
      } else {
        const local = readLocalPrefs();
        runInAction(() => {
          this.profile = null;
          this.preferences = { ...DEFAULT_PREFS, ...(local || {}) };
          this.favorites = [];
        });
      }
    } catch (err) {
      runInAction(() => {
        this.error = err?.message || String(err);
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  // ===== Preferences =====
  async savePreferences(pref) {
    this.error = null;
    try {
      if (this.isLoggedIn) {
        const updated = await upsertPreferences({
          diet: pref.diet,
          intolerances: pref.intolerances,
          show_allergens: !!pref.show_allergens,
        });
        runInAction(() => {
          this.preferences = { ...DEFAULT_PREFS, ...(updated || pref) };
        });
      } else {
        writeLocalPrefs(pref);
        runInAction(() => {
          this.preferences = { ...DEFAULT_PREFS, ...pref };
        });
      }
    } catch (err) {
      runInAction(() => {
        this.error = err?.message || String(err);
      });
    }
  }

  // ===== Favorites =====
  async toggleFavorite(recipe) {
    if (!this.isLoggedIn) {
      runInAction(() => {
        this.error = "Sign in to use favorites.";
      });
      return;
    }
    try {
      const res = await toggleFavoriteDb(recipe);
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
        this.error = err?.message || String(err);
      });
    }
  }

  isFavorite(recipeId) {
    return this.favoriteIds.has(String(recipeId));
  }

  // ===== Sign out passthrough (optional for UI) =====
  async signOut() {
    if (typeof this._signOut === "function") {
      await this._signOut();
      console.log("signed out");
    }
    // In case the provider event is delayed, proactively reset UI state
    this.reset();
  }
}

const user = new UserStore();
export default user;
export { DEFAULT_PREFS };
