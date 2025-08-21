import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./Categories.css";

const preferences = [
  {
    title: "Miscellaneous",
    img: "/img/categories/beef.png",
    desc: "A variety of dishes rich in meat for those who enjoy protein-packed meals.",
    category: "misc"
  },
  {
    title: "Vegan",
    img: "/img/categories/vegan.png",
    desc: "Plant-based meals full of flavor, perfect for a healthy lifestyle.",
    category: "Vegan"
  },
  {
    title: "Vegetarian",
    img: "/img/categories/vegetarian.png",
    desc: "Delicious meals without meat, combining vegetables, grains, and dairy.",
    category: "Vegetarian" 
  },
];

const Preferences = () => (
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
    {preferences.map((data, index) => (
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
                <Link to={`/category/${data.category.toLowerCase()}`} className="fw-bold">            
                  Learn More
                </Link>
              </div>
            </div>   
      </SwiperSlide>
    ))}

  </Swiper>
);

export default Preferences;
