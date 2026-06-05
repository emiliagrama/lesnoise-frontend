import { Link } from "react-router-dom";
import "../components/AppNavbar.css";

export default function AppNavbar({
  showSettings = true,
  showBackArrow = false,
}) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header className="lesnoise-header">
      <div className="lesnoise-shell lesnoise-header__inner">
      <Link to="/dashboard" className="lesnoise-logo">
        {showBackArrow && "← "}
        lesnoise
      </Link>

        <nav className="lesnoise-header__nav">
          {showSettings && (
            <Link to="/settings" className="lesnoise-header__login">
              Settings
            </Link>
          )}

          <button
            type="button"
            className="lesnoise-header__signup"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}