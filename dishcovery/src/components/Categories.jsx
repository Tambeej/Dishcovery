import React, { useState } from "react";
// import { Link } from "react-router-dom";
import Dishes from "./Dishes";
import Preferences from "./Preferences";
import "./Categories.css";

const Categories = () => {
  const [activeTab, setActiveTab] = useState("preferences");

  return (
    <div id="categories" className="container-fluid py-5 bg-light">
      <div className="container text-center">
        <h2>Categories</h2>

        {/* Tabs  */}
        <div className="d-flex justify-content-center gap-3 mb-5">
          <button
            className={`btn btn-sm ${activeTab === "preferences" ? "btn-success" : "btn-outline-success"
              }`}
            onClick={() => setActiveTab("preferences")}
          >
            PREFERENCES
          </button>
          <button
            className={`btn btn-sm ${activeTab === "dishes" ? "btn-success" : "btn-outline-success"
              }`}
            onClick={() => setActiveTab("dishes")}
          >
            DISHES
          </button>
        </div>

        {/* Sections */}
        <div className="position-relative">
          {activeTab === "preferences" ? <Preferences /> : <Dishes />}
        </div>
      </div>
    </div>
  );
};

export default Categories;