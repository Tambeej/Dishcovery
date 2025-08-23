//  Form input for ingredients (tags or multi-select).
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import ingredientStore from "../stores/ingredientStore";

const Ingredients = observer(() => {
  useEffect(() => {
    ingredientStore.fetchAllIngredients();
  }, []);

  if (ingredientStore.loading) return <p>Loading...</p>;

  return (
    <div className="container text-center my-5">
      <h2 className="mb-4 text-success">Catch your favorite</h2>
      <div className="row justify-content-center">
        {ingredientStore.randomIngredients.map((ing, i) => (
          <div key={i} className="col-6 col-md-2 mb-4">
            <Link to={`/ingredients/${ing}`}>
              <div className="card shadow-sm p-3">
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
        className="btn btn-success mt-3"
        onClick={() => ingredientStore.pickRandomIngredients()}
      >
        Catch
      </button>
    </div>
  );
});

export default Ingredients;
