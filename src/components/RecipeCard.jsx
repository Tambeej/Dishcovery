// Recipe preview (title, image, time).

import React from "react";
import { Link } from "react-router-dom";
import "./RecipeCard.css";

const RecipeCard = ({ recipe }) => {
  return (
    <div className="card recipe-card shadow-sm border-0 h-100">
      <img
        src={recipe.image}
        alt={recipe.title}
        className="card-img-top recipe-img"
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{recipe.title}</h5>
        <div className="mt-auto">
          <Link
            to={`/recipe/${recipe.id}`}
            className="learn-more-link fw-bold"
          >
            Learn More →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;