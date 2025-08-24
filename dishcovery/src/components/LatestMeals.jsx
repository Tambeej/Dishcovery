import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLatestRecipes } from "../services/api";
import "./RandomMeals.css";

const LatestMeals = () => {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getLatestRecipes();
        setRecipes(data.slice(0, 5)); // ✅ only first 5
      } catch (err) {
        console.error("Error fetching latest recipes:", err);
      }
    }
    fetchData();
  }, []);

  return (
    <div id="random-meals" className="random-meals container-fluid py-5 bg-light">
      <div className="container text-center">
        <h2>
          Latest Recipes
        </h2>
        <div className="meals-grid">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="meal-card"
              onClick={() => navigate(`/recipe/${recipe.id}`)}
            >
             <img src={recipe.image} alt={recipe.title} className="meal-img" />
            <div className="recipe-overlay">
              <h3>{recipe.title}</h3>
              <p>{recipe.instructions?.slice(0, 100)}...</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LatestMeals;
