import { inject, observer } from "mobx-react";
import React, { useState, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

function CountryInput({ disabled, onChange, recipeStore }) {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countries, setCountries] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!recipeStore.areas.length) {
      recipeStore.fetchAreas();
    }
  }, [recipeStore]);

  const addCountry = () => {
    if (selectedCountry && !countries.includes(selectedCountry)) {
      const updated = [...countries, selectedCountry];
      setCountries(updated);
      onChange(updated);
      setSelectedCountry("");
      setSuggestions([]);
    }
  };

  const removeCountry = (index) => {
    const newCountries = countries.filter((_, i) => i !== index);
    setCountries(newCountries);
    onChange(newCountries);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSelectedCountry(value);

    if (value.trim()) {
      const filtered = recipeStore.areas.filter((ing) =>
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
          placeholder="Browse by Country"
          value={selectedCountry}
          onChange={handleInputChange}
          disabled={disabled}
        />

        <button
          type="button"
          className="btn btn-success"
          onClick={addCountry}
          disabled={!selectedCountry}
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
                setSelectedCountry(item);
                setSuggestions([]);
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3">
        {countries.map((item, index) => (
          <span key={item} className="badge bg-primary me-2">
            {item}{" "}
            <button
              type="button"
              className="btn-close btn-close-white ms-1"
              onClick={() => removeCountry(index)}
              aria-label="Remove"
            ></button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default inject("recipeStore")(observer(CountryInput));
