import React from "react";
import { Link } from "react-router-dom";

const dishes = [
  {
    title: "Starters",
    img: "/img/categories/starters.png",
    desc: "Small tasty bites to begin your meal with flavor and freshness.",
  },
  {
    title: "Main Dishes",
    img: "/img/categories/main.png",
    desc: "Hearty and delicious meals to satisfy your hunger.",
  },
  {
    title: "Breakfast",
    img: "/img/categories/breakfast.png",
    desc: "Kickstart your day with healthy and filling breakfast meals.",
  },
  {
    title: "Side",
    img: "/img/categories/side.png",
    desc: "Perfect complements to main dishes, small but delicious.",
  },
  {
    title: "Desserts",
    img: "/img/categories/dessert.png",
    desc: "Sweet treats to end your meal on a high note.",
  },
];

const Dishes = () => (
  <div className="row justify-content-center g-4">
    {dishes.map((d, i) => (
      <div key={i} className="col-md-4 col-lg-3">
        <div className="card h-100 shadow-sm border-0 category-card">
          <img src={d.img} className="card-img-top" alt={d.title} />
          <div className="card-body">
            <h5 className="card-title">{d.title}</h5>
            <p className="card-text">{d.desc}</p>
            <Link to={`/category/${d.title.toLowerCase()}`} className="text-success fw-bold">
              Learn More →
            </Link>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default Dishes;
