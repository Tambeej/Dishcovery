import userStore from "./userStore";
import recipeStore from "./recipeStore";

class RootStore {
  userStore = userStore;
  recipeStore = recipeStore;
}


const rootStore = new RootStore();
export default rootStore;