import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer bg-dark text-light">
      <div className="container py-4 d-flex flex-column align-items-center">
        {/* Logo */}
        <Link to="/" className="footer-logo mb-3">
          <img
            src="/img/logo/dishcovery-high-resolution-logo-transparent (1).png"
            alt="Dishcovery Logo"
            height="40"
          />
        </Link>

        {/* Footer Nav */}
        <ul className="footer-nav list-unstyled d-flex flex-wrap justify-content-center mb-3">
          <li className="mx-3">
            <Link className="text-light text-decoration-none" to="/">
              Home
            </Link>
          </li>
          <li className="mx-3">
            <Link className="text-light text-decoration-none" to="/categories">
              Categories
            </Link>
          </li>
          <li className="mx-3">
            <Link className="text-light text-decoration-none" to="/favorites">
              Favorite Meals
            </Link>
          </li>
          <li className="mx-3">
            <Link className="text-light text-decoration-none" to="/blog">
              Blog
            </Link>
          </li>
          <li className="mx-3">
            <Link className="text-light text-decoration-none" to="/contact">
              Contacts
            </Link>
          </li>
        </ul>

        {/* Terms & Copyright */}
        <div className="footer-info text-center small">
          <Link to="/terms" className="text-secondary text-decoration-none me-3">
            Terms & Conditions
          </Link>
          <span>© {new Date().getFullYear()} Dishcovery. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
