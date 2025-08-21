import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../components/NavBar"; // your existing navbar
import "./RecipesPage.css";

const RecipesPage = () => {
  const { category } = useParams();   // e.g. "/vegan", "/american"
  const location = useLocation();     // to support search query
  const [recipes, setRecipes] = useState([]);
  const [pageTitle, setPageTitle] = useState("");

  useEffect(() => {
    // Check if this is a search result
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get("q");

    if (query) {
      setPageTitle(`Search results for "${query}"`);
      // 🔥 Fetch recipes by search API
      fetch(`/api/recipes/search?q=${query}`)
        .then(res => res.json())
        .then(data => setRecipes(data))
        .catch(console.error);
    } else if (category) {
      setPageTitle(category.charAt(0).toUpperCase() + category.slice(1));
      // 🔥 Fetch recipes by category
      fetch(`/api/recipes/category/${category}`)
        .then(res => res.json())
        .then(data => setRecipes(data))
        .catch(console.error);
    }
  }, [category, location.search]);

  return (
    <div className="recipes-page">
      {/* Hero Section */}
      <div className="hero bg-light py-5 shadow-sm mb-5">
        <Navbar />
        <div className="container text-center">
          <h1 className="text-success fw-bold">{pageTitle}</h1>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="container">
        <div className="row g-4">
          {recipes.map((recipe, index) => (
            <div key={index} className="col-12 col-sm-6 col-lg-3">
              <div className="card recipe-card h-100 shadow-sm">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{recipe.title}</h5>
                  <p className="card-text flex-grow-1">{recipe.description}</p>
                  <a href={`/recipe/${recipe.id}`} className="btn btn-outline-success mt-auto">
                    View Recipe
                  </a>
                </div>
              </div>
            </div>
          ))}

          {recipes.length === 0 && (
            <div className="text-center py-5">
              <h4>No recipes found</h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipesPage;
