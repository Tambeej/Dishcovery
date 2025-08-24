import { Link, useNavigate } from "react-router-dom";
import "./TopBar.css";
import { observer } from "mobx-react-lite";
import user from "../stores/userStore";

function TopBar() {
  const navigate = useNavigate();

  async function handleSignOut(e) {
    e.preventDefault(); // prevent default link nav
    await user.signOut(); // single source of truth
    navigate("/"); // or navigate("/login")
  }

  const isLoggedIn = user.isLoggedIn; // reactive
  const displayName = user.displayName; // implement getter in store (profile/meta/email)

  const NavIconLink = ({ to, icon, label, onClick, className = "" }) => (
    <Link
      to={to}
      onClick={onClick}
      className={`d-flex align-items-center text-decoration-none text-light me-3 ${className}`}
    >
      <img
        src={`/img/svg/${icon}`}
        alt={label}
        width="16"
        height="16"
        className="me-2"
      />
      {label}
    </Link>
  );

  return (
    <div id="login" className="container-fluid bg-dark py-1">
      <div className="container d-flex text-right flex-row-reverse justify-content-start">
        {!isLoggedIn ? (
          <NavIconLink to="/login" icon="login.svg" label="Login | Signup" />
        ) : (
          <>
            <span className="text-light me-3">Hello, {displayName}</span>
            <NavIconLink to="/profile" icon="user.svg" label="Profile" />
            {/* IMPORTANT: no /logout route. Call signOut instead. */}
            <NavIconLink
              to="/"
              icon="logout.svg"
              label="Logout"
              onClick={handleSignOut}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default observer(TopBar);
