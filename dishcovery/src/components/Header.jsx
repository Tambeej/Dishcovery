// Navigation bar (links to routes).
//

import { Link } from "react-router-dom";
import "./Header.css";
import Navbar from "./Navbar";

function Header() {
  return (
    <header className="hero-section">
      {/* Overlay */}
      <div className="overlay"></div>
      <Navbar />
      {/* Hero Content */}
      <div>
        <h1>Dishcovery</h1>
        <p>
          Your smart cooking companion that helps you decide what to eat based
          on your personal food preferences and the ingredients you already have
          at home
        </p>
        <Link to="/search">Lets Start</Link>
      </div>
    </header>
  );
}

export default Header;
