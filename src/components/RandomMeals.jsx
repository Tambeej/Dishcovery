import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import recipeStore from "../stores/recipeStore";
import { useNavigate } from "react-router-dom";
import "./RandomMeals.css";

const RandomMeals = observer(() => {
  const navigate = useNavigate();

  useEffect(() => {
    recipeStore.fetchRandomMeals(5);
  }, []);

  return (
     <div id="random-meals" className="random-meals container-fluid py-5 bg-light">
      <div className="container text-center">
   
      <h2>Random Meals</h2>
      <div className="meals-grid">
        {recipeStore.randomMeals.map((meal) => (          
          <div
            key={meal.id}
            className="meal-card"
            onClick={() => navigate(`/recipe/${meal.id}`)}
          >
            <img src={meal.image} alt={meal.title} className="meal-img" />
            <div className="meal-overlay">
              <h3>{meal.title}</h3>
              <p>{meal.instructions?.slice(0, 50)}...</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
});

export default RandomMeals;
