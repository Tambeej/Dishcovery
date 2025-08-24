//  Form input for ingredients (tags or multi-select).
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import ingredientStore from "../stores/ingredientStore";
import "./Ingredients.css";
const Ingredients = observer(() => {
  useEffect(() => {
    ingredientStore.fetchAllIngredients();
  }, []);

  if (ingredientStore.loading) return <p>Loading...</p>;

  return (
    <div className="container text-center my-5">
      <h2>Catch your favorite</h2>
      <div className="row justify-content-center">
        {ingredientStore.randomIngredients.map((ing, i) => (
          <div key={i} className="col-6 col-md-2 mb-4">
            <Link to={`/ingredients/${ing}`}>
              <div className="card p-3">
                <img
                  src={`https://www.themealdb.com/images/ingredients/${ing}.png`}
                  alt={ing}
                  className="img-fluid"
                />
                <p className="mt-2">{ing}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <button
        className="btn btn-main mt-3"
        onClick={() => ingredientStore.pickRandomIngredients()}
      >
        Catch
      </button>
    </div>
  );
});

export default Ingredients;
