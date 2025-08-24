// Navigation bar (links to routes).
// 

import { Link } from "react-router-dom";
import "./TopBar.css";

function TopBar({ isLoggedIn = false, userName = "" }) {

  const NavIconLink = ({ to, icon, label, className = "" }) => (
    <Link to={to} className={`d-flex align-items-center text-decoration-none text-light me-3 ${className}`}>
      <img src={`/img/svg/${icon}`} alt={label} width="16" height="16" className="me-2" />
      {label}
    </Link>
  );

  return (
      <div id="login" className="container-fluid bg-dark py-1">
        <div className="container d-flex text-right flex-row-reverse justify-content-start">
          {!isLoggedIn ? (
            <>
              <NavIconLink to="/login" icon="login.svg" label="Login | Signup" />
              {/* <p className="text-light">|</p>
              <NavIconLink to="/signup" icon="signup.svg" label="Signup" /> */}
            </>
          ) : (
            <>
              <span className="me-3">Hello, {userName || "User"}</span>
              <NavIconLink to="/profile" icon="user.svg" label="User" />
              <NavIconLink to="/logout" icon="logout.svg" label="Logout" />
            </>
          )}
        </div>
      </div>    
  );
}

export default TopBar;