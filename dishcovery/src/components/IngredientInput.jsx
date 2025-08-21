//  Form input for ingredients (tags or multi-select).

import React, { useState, useEffect } from "react";
import { filterByIngredient } from "../../api"; 

function IngredientInput({ disabled, onChange }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (!query) {
        setSuggestions([]);
        return;
      }
      const data = await filterByIngredient(query); // API call
      setSuggestions(data.slice(0, 5)); // first 5
    };
    load();
  }, [query]);

  return (
    <div className="position-relative">
      <input
        type="text"
        className="form-control"
        placeholder="Browse by Ingredient"
        value={query}
        disabled={disabled}
        onChange={(e) => setQuery(e.target.value)}
      />
      {suggestions.length > 0 && (
        <ul className="list-group position-absolute w-100" style={{ zIndex: 10 }}>
          {suggestions.map((item) => (
            <li
              key={item}
              className="list-group-item list-group-item-action"
              onClick={() => {
                setQuery(item);
                setSuggestions([]);
                onChange(item);
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default IngredientInput;
