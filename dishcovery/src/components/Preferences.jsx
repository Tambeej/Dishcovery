import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Categories.css";

const preferences = [
  {
    title: "Meat Friendly",
    img: "/img/categories/beef.png",
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
  <Swiper
    modules={[Navigation, Pagination]}
    spaceBetween={20}
    slidesPerView={1}
    navigation
    pagination={{ clickable: true }}
    breakpoints={{
      768: { slidesPerView: 2 },
      992: { slidesPerView: 3 },
    }}
  >
    {preferences.map((item, index) => (
      <SwiperSlide key={index}>
        <div className="card category-card">
          <img
            src={item.img}
            alt={item.title}
            className="card-img"
          />
          <div className="card-body d-flex flex-column">
            <h5 className="card-title">{item.title}</h5>
            <p className="card-text flex-grow-1">{item.desc}</p>
            <Link to={`/category/${item.title.toLowerCase()}`} className="text-success fw-bold">
              Learn More →
            </Link>
          </div>
        </div>
      </SwiperSlide>
    ))}

  </Swiper>
);

export default Preferences;
