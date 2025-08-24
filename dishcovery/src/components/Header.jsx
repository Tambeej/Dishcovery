// Navigation bar (links to routes).
//

import { Link } from "react-router-dom";
import "./Header.css";
import Navbar from "./NavBar";

function Header() {
  return (
    <header className="hero-section">
      {/* Overlay */}
      <div className="overlay"></div>
      <div className="container-fluid ">
        {/* Navbar Content */}
        <Navbar />
        {/* Hero Content */}
        <div className="container hero-text">
          <h1>Dishcovery</h1>
          <p>
            Your smart cooking companion that helps you decide what to eat based
            on <br></br>your personal food preferences and the ingredients you already have
            at home
          </p>
          <button
            className="btn btn-main mt-3"
            onClick={() => {
              const searchEl = document.getElementById("search");
              if (searchEl) {
                searchEl.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Lets Start
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
