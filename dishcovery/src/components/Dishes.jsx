import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./Categories.css";

const dishes = [
  {
    title: "Starters",
    img: "/img/categories/starter.png",
    desc: "Small tasty bites to begin your meal with flavor and freshness.",
    category: "Starter",
  },
  {
    title: "Main Dishes",
    img: "/img/categories/beef.png",
    desc: "Hearty and delicious meals to satisfy your hunger.",
    category: "Main",
  },
  {
    title: "Breakfast",
    img: "/img/categories/breakfast.png",
    desc: "Kickstart your day with healthy and filling breakfast meals.",
    category: "Breakfast",
  },
  {
    title: "Side",
    img: "/img/categories/side.png",
    desc: "Perfect complements to main dishes, small but delicious.",
    category: "Side",
  },
  {
    title: "Desserts",
    img: "/img/categories/dessert.png",
    desc: "Sweet treats to end your meal on a high note.",
    category: "Dessert",
  },
];

const Dishes = () => {
    useEffect(() => {
    function equalizeHeights() {
      const cards = document.querySelectorAll(".category-card .card-body");
      let maxHeight = 0;
      cards.forEach((c) => {
        c.style.height = "auto"; // reset
        maxHeight = Math.max(maxHeight, c.offsetHeight);
      });
      cards.forEach((c) => (c.style.height = maxHeight + "px"));
    }

    equalizeHeights();
    window.addEventListener("resize", equalizeHeights);
    return () => window.removeEventListener("resize", equalizeHeights);
  }, []);

  return (
    <Swiper
      modules={[Pagination]}
      spaceBetween={20}
      slidesPerView={1}
      
      pagination={{ clickable: true }}
      breakpoints={{
        768: { slidesPerView: 2 },
        992: { slidesPerView: 3 },
      }}
    >
      {dishes.map((data, index) => (
      <SwiperSlide key={index} >    
       <div className="card h-100 shadow-sm border-0 category-card d-flex flex-column">
          <img
            src={data.img}
            alt={data.title}
            className="card-img"
           
          />
          <div className="card-body d-flex flex-column">
            <h5 className="card-title">{data.title}</h5>
            <p className="card-text flex-grow-1">{data.desc}</p>
            <Link to={`/category/${data.category.toLowerCase()}`} className="fw-bold mt-auto">
              Learn More
            </Link>
          </div>
        </div>   
       </SwiperSlide>
    ))}
  </Swiper>
 
);
};
export default Dishes;
