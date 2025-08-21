import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Categories.css";

const dishes = [
  {
    title: "Starters",
    img: "/img/categories/starter.png",
    desc: "Small tasty bites to begin your meal with flavor and freshness.",
  },
  {
    title: "Main Dishes",
    img: "/img/categories/beef.png",
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
      <SwiperSlide key={index} className="col-md-4 col-lg-3">    
        <div className="card h-100 shadow-sm border-0 category-card d-flex flex-column">
          <img
            src={data.img}
            alt={data.title}
            className="card-img"
           
          />
          <div className="card-body">
            <h5 className="card-title">{data.title}</h5>
            <p className="card-text">{data.desc}</p>
            <Link to={`/category/${data.title.toLowerCase()}`} className="fw-bold">
              Learn More
            </Link>
          </div>
        </div>   
       </SwiperSlide>
    ))}
  </Swiper>
 
);

export default Dishes;
