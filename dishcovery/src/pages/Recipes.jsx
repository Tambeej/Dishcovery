import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { inject, observer } from "mobx-react";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import YouTube from "react-youtube";

const Recipe = ({ recipeStore }) => {
  const { id } = useParams();
  const [videoId, setVideoId] = useState("");

  // Fetch recipe and extract YouTube ID
  useEffect(() => {
    const fetch = async () => {
      await recipeStore.fetchRecipeDetails(id);
      const recipe = recipeStore.currentRecipe;
      if (recipe?.youtube) {
        const match = recipe.youtube.match(/(?:v=|\.be\/)([^&]+)/);
        setVideoId(match ? match[1] : "");
      }
    };
    fetch();
  }, [id, recipeStore]);

  const recipe = recipeStore.currentRecipe;

  if (recipeStore.loading) return <LoadingSpinner />;
  if (recipeStore.error) return <ErrorMessage message={recipeStore.error} />;
  if (!recipe) return <p>Loading recipe...</p>;

  const opts = {
    width: "100%",
    playerVars: { autoplay: 0, controls: 1 },
  };

  return (
    <div className="container my-5">
      {/* Title */}
      <h1 className="display-4 text-center mb-4">{recipe.title}</h1>

      {/* Image */}
      <div className="text-center mb-4">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="img-fluid rounded shadow"
          style={{ maxHeight: "400px", objectFit: "cover", width: "100%" }}
        />
      </div>

      <div className="row">
        {/* Ingredients */}
        <div className="col-md-4 mb-4">
          <div className="card shadow h-100">
            <div className="card-header bg-success text-white fw-bold">
              Ingredients
            </div>
            <ul className="list-group list-group-flush">
              {recipe.ingredients.map((ing, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <Link to={`/ingredients/${ing.ingredient}`} className="text-decoration-none">
                    {ing.ingredient}
                  </Link>
                  <span className="badge bg-secondary">{ing.measure}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Instructions */}
        <div className="col-md-8 mb-4">
          <div className="card shadow h-100">
            <div className="card-header bg-primary text-white fw-bold">
              Instructions
            </div>
            <div className="card-body">
              <p>{recipe.instructions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* YouTube Video */}
      {videoId && (
        <div className="mt-4">
          <h3 className="h5 mb-3">Video Tutorial</h3>
          <YouTube videoId={videoId} opts={opts} />
        </div>
      )}
    </div>
  );
};

export default inject("recipeStore")(observer(Recipe));
