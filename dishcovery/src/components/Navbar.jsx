// Navigation bar (links to routes).
// 

import { Link } from "react-router-dom";
import "./Header.css";

function Navbar() {
    return (
            <nav className="navbar navbar-expand-lg navbar-dark">
                <div className="container flex-row">
                    {/* Logo */}
                    <Link className="navbar-brand d-flex align-items-center" to="/home">
                        <img
                            src="/img/logo/dishcovery-high-resolution-logo-transparent (1).png"
                            alt="Dishcovery Logo"
                            //   width="40"
                            height="40"
                            className="me-2"
                        />
                    </Link>

                    {/* Toggler */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Nav Links */}
                    <div
                        className="collapse navbar-collapse justify-content-end"
                        id="navbarNav"
                    >
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/home">
                                    Home
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/categories">
                                    Categories
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/favorites">
                                    Favorite Meals
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/blog">
                                    Blog
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/contact">
                                    Contacts
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

    );
}

export default Navbar;
