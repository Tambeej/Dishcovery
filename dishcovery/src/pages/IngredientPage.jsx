import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import ingredientStore from "../stores/ingredientStore";
import Navbar from "../components/NavBar";

const IngredientPage = observer(() => {
  const { name } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    ingredientStore.fetchRecipesByIngredient(name);
  }, [name]);

  if (ingredientStore.loading) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="container text-center my-5">
        <h1>{name}</h1>
        <img
          src={`https://www.themealdb.com/images/ingredients/${name}.png`}
          alt={name}
          className="img-fluid my-3"
          style={{ maxHeight: "200px" }}
        />
        <p>{ingredientStore.ingredientRecipes.length} recipes available</p>
        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate(`/recipes/ingredient/${name}`)}
        >
          Let’s Cook
        </button>
      </div>
    </>
  );
});

export default IngredientPage;