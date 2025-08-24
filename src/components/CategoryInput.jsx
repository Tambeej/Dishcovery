import { inject, observer } from "mobx-react";
import React, { useState, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

function CategoryInput({ disabled, onChange, recipeStore }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!recipeStore.categories.length) {
      recipeStore.fetchCategories();
    }
  }, [recipeStore]);

  const addCategory = () => {
    if (selectedCategory && !categories.includes(selectedCategory)) {
      const updated = [...categories, selectedCategory];
      setCategories(updated);
      onChange(updated);
      setSelectedCategory("");
      setSuggestions([]);
    }
  };

  const removeCategory = (index) => {
    const newCategories = categories.filter((_, i) => i !== index);
    setCategories(newCategories);
    onChange(newCategories);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);

    if (value.trim()) {
      const filtered = recipeStore.categories.filter((ing) =>
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
          placeholder="Browse by Category"
          value={selectedCategory}
          onChange={handleInputChange}
          disabled={disabled}
        />

        <button
          type="button"
          className="btn btn-success"
          onClick={addCategory}
          disabled={!selectedCategory}
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
                setSelectedCategory(item);
                setSuggestions([]);
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3">
        {categories.map((item, index) => (
          <span key={item} className="badge bg-primary me-2">
            {item}{" "}
            <button
              type="button"
              className="btn-close btn-close-white ms-1"
              onClick={() => removeCategory(index)}
              aria-label="Remove"
            ></button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default inject("recipeStore")(observer(CategoryInput));
