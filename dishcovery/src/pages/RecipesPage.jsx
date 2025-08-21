import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { filterByCategory, searchRecipes, getCategories } from "../services/api";
import Navbar from "../components/NavBar";
import RecipeCard from "../components/RecipeCard";


const RecipesPage = () => {
  const { category } = useParams();   // e.g. "/vegan", "/american"
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      let results = [];
      try {
        const allCategories = await getCategories(); // gives array of names

        // Handle "misc" (Preferences → everything except Vegan + Vegetarian)
        if (category === "misc") {
          const miscCategories = allCategories.filter(
            (c) => c.toLowerCase() !== "vegan" && c.toLowerCase() !== "vegetarian"
          );
          let allMeals = [];
          for (const cat of miscCategories) {
            const data = await filterByCategory(cat);
            allMeals = [...allMeals, ...data];
          }
          setMeals(allMeals);
          return;
        }

        // Handle "main" (Dishes → everything except Starter, Breakfast, Side, Dessert)
        if (category === "main") {
          const notMain = ["Starter", "Breakfast", "Side", "Dessert"];
          const mainCategories = allCategories.filter(
            (c) => !notMain.includes(c)
          );

          let allMeals = [];
          for (const cat of mainCategories) {
            const data = await filterByCategory(cat);
            allMeals = [...allMeals, ...data];
          }
          setMeals(allMeals);
          return;
        }

        // Default: just fetch meals by single category
        const data = await filterByCategory(category);
        setMeals(data);
      } catch (err) {
        console.error("Error fetching meals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <>
      <header id="recipe-page" className="hero-section">
        {/* Hero Section */}
        <div className="hero container-fluid">
          <Navbar />
          <div className="container hero-text text-center">
            <h1>{category === "misc" ? "Miscellaneous Recipes" : category}</h1>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="container mx-auto px-6 py-10">
        <div className="row">
          {meals.map((recipe) => (
            <div key={recipe.id} className="col-12 col-sm-6 col-lg-4 mb-5 mt-5"> {/* ✅ changed */}
              <RecipeCard recipe={recipe} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default RecipesPage;
