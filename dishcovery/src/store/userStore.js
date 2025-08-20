import { makeAutoObservable } from "mobx";

class UserStore {
  user = null;
  isLoggedIn = false;
  allergies = [];
  mealPreferences = "";
  favorites = [];

  constructor() {
    makeAutoObservable(this);
  }

  setUser(user) {
    this.user = user;
  }
  async login(email, password) {}

  async register(email, password) {}

  async logout(){}

  async loadPreferences(){}

  async savePreferences(allergies, mealPreferences) {}

  async loadFavorites() {}

  async toggleFavorite(mealId) {}

}

export const userStore = new UserStore();
