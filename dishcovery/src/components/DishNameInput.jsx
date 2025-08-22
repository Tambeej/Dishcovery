import { inject, observer } from "mobx-react";
import React, { useState, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

function DishNameInput({ disabled, onChange, recipeStore }) {
  const [selectedName, setSelectedName] = useState("");
  const [names, setNames] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!recipeStore.names.length) {
      recipeStore.getAllMealNames();
    }
  }, [recipeStore]);

  const addName = () => {
    if (selectedName && !names.includes(selectedName)) {
      const updated = [...names, selectedName];
      setNames(updated);
      onChange(updated);
      setSelectedName("");
      setSuggestions([]);
    }
  };

  const removeName = (index) => {
    const newNames = names.filter((_, i) => i !== index);
    setNames(newNames);
    onChange(newNames);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSelectedName(value);

    if (value.trim()) {
      const filtered = recipeStore.meals
        .filter((meal) =>
          meal.title.toLowerCase().includes(value.toLowerCase())
        )
        .map((meal) => meal.title);
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
          placeholder="Browse by Name"
          value={selectedName}
          onChange={handleInputChange}
          disabled={disabled}
        />

        <button
          type="button"
          className="btn btn-success"
          onClick={addName}
          disabled={!selectedName}
        >
          Add
        </button>
      </div>

      {suggestions.length > 0 && (
        <ul
          className="list-group position-absolute w-100"
          style={{ zIndex: 10 }}
        >
          {suggestions.map((item) => (
            <li
              key={item}
              className="list-group-item list-group-item-action"
              onClick={() => {
                setSelectedName(item);
                setSuggestions([]);
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3">
        {names.map((item, index) => (
          <span key={item} className="badge bg-primary me-2">
            {item}{" "}
            <button
              type="button"
              className="btn-close btn-close-white ms-1"
              onClick={() => removeName(index)}
              aria-label="Remove"
            ></button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default inject("recipeStore")(observer(DishNameInput));
