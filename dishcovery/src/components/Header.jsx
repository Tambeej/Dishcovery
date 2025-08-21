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
        <div className="container hero-text flex-column ">
          <h1>Dishcovery</h1>
          <p>
            Your smart cooking companion that helps you decide what to eat based
            on <br></br>your personal food preferences and the ingredients you already have
            at home
          </p>
          <Link to="#search">Lets Start</Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
