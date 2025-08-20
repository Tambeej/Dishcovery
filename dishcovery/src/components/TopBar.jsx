// Navigation bar (links to routes).
// 

import { Link } from "react-router-dom";

function TopBar({ isLoggedIn = false, userName = "" }) {
  // Helper to render icon + text
  const NavIconLink = ({ to, icon, label, className = "" }) => (
    <Link to={to} className={`d-flex align-items-center text-decoration-none text-dark me-3 ${className}`}>
      <img src={`/img/svg/${icon}`} alt={label} width="16" height="16" className="me-1" />
      {label}
    </Link>
  );

  return (
    <div className="bg-light border-bottom">
      <div className="container-fluid d-flex justify-content-end align-items-center py-1">
        {!isLoggedIn ? (
          <>
            <NavIconLink to="/login" icon="login.svg" label="Login" />
            <NavIconLink to="/signup" icon="signup.svg" label="Signup" />
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