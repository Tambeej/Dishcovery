import React from "react";
import { Link } from "react-router-dom";

const preferences = [
  {
    title: "Meat Friendly",
    img: "/img/categories/meat.png",
    desc: "A variety of dishes rich in meat for those who enjoy protein-packed meals.",
  },
  {
    title: "Vegan",
    img: "/img/categories/vegan.png",
    desc: "Plant-based meals full of flavor, perfect for a healthy lifestyle.",
  },
  {
    title: "Vegetarian",
    img: "/img/categories/vegetarian.png",
    desc: "Delicious meals without meat, combining vegetables, grains, and dairy.",
  },
];

const Preferences = () => (
  <div className="row justify-content-center g-4">
    {preferences.map((p, i) => (
      <div key={i} className="col-md-4">
        <div className="card h-100 shadow-sm border-0 category-card">
          <img src={p.img} className="card-img-top" alt={p.title} />
          <div className="card-body">
            <h5 className="card-title">{p.title}</h5>
            <p className="card-text">{p.desc}</p>
            <Link to={`/category/${p.title.toLowerCase()}`} className="text-success fw-bold">
              Learn More →
            </Link>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default Preferences;
