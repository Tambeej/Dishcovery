import { inject, observer } from "mobx-react";
import React, { useState, useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

function IngredientInput({ disabled, onChange, recipeStore }) {
  const [selectedIngredient, setSelectedIngredient] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!recipeStore.ingredientList.length) {
      recipeStore.getAllIngredients();
    }
  }, [recipeStore]);

  const addIngredient = () => {
    if (selectedIngredient && !ingredients.includes(selectedIngredient)) {
      const updated = [...ingredients, selectedIngredient];
      setIngredients(updated);
      onChange(updated);
      setSelectedIngredient("");
      setSuggestions([]);
    }
  };

  const removeIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
    onChange(newIngredients);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSelectedIngredient(value);

    if (value.trim()) {
      const filtered = recipeStore.ingredientList.filter((ing) =>
        ing.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5)); 
    } else {
      setSuggestions([]);
    }
  };

  if (recipeStore.loading) return <LoadingSpinner />;
  if (recipeStore.error) return <ErrorMessage message={recipeStore.error} />;

  return (
    <div className="mb-3 position-relative">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Browse by Ingredient"
          value={selectedIngredient}
          onChange={handleInputChange}
          disabled={disabled}
        />

        <button
          type="button"
          className="btn btn-success"
          onClick={addIngredient}
          disabled={!selectedIngredient}
        >
          Add
        </button>
      </div>

      {suggestions.length > 0 && (
        <ul className="list-group position-absolute w-100" style={{ zIndex: 10 }}>
          {suggestions.map((item) => (
            <li
              key={item}
              className="list-group-item list-group-item-action"
              onClick={() => {
                setSelectedIngredient(item);
                setSuggestions([]);
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3">
        {ingredients.map((item, index) => (
          <span key={item} className="badge bg-primary me-2">
            {item}{" "}
            <button
              type="button"
              className="btn-close btn-close-white ms-1"
              onClick={() => removeIngredient(index)}
              aria-label="Remove"
            ></button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default inject("recipeStore")(observer(IngredientInput));
