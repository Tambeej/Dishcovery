import React, { useState } from "react";
import { Link } from "react-router-dom";
import Dishes from "./Dishes";
import Preferences from "./Preferences";
import "./Categories.css";

const Categories = () => {
   const [activeTab, setActiveTab] = useState("preferences");

     return (
    <div id="categories" className="container-fluid py-5 bg-light">
      <div className="container text-center">
        <h2 className="mb-4 text-success fw-bold">Categories</h2>

        {/* Toggle Buttons */}
        <div className="d-flex justify-content-center gap-3 mb-5">
          <button
            className={`btn btn-sm ${
              activeTab === "preferences" ? "btn-success" : "btn-outline-success"
            }`}
            onClick={() => setActiveTab("preferences")}
          >
            PREFERENCES
          </button>
          <button
            className={`btn btn-sm ${
              activeTab === "dishes" ? "btn-success" : "btn-outline-success"
            }`}
            onClick={() => setActiveTab("dishes")}
          >
            DISHES
          </button>
        </div>

        {/* Sliding Content */}
        <div
          className="d-flex transition"
          style={{
            transform: activeTab === "preferences" ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.5s ease-in-out",
            width: "200%", // two panels side by side
          }}
        >
          <div style={{ width: "50%" }}>
            <Preferences />
          </div>
          <div style={{ width: "50%" }}>
            <Dishes />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;