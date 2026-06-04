import { Link } from "react-router-dom";
import "../components/AppNavbar.css";

export default function AppNavbar({
  showBackToDashboard = false,
  showSettings = true,
}) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header className="lesnoise-header">
      <div className="lesnoise-shell lesnoise-header__inner">
        <Link to="/dashboard" className="lesnoise-logo">
          lesnoise
        </Link>

        <nav className="lesnoise-header__nav">
          {showSettings && (
            <Link to="/settings" className="lesnoise-header__login">
              Settings
            </Link>
          )}

          {showBackToDashboard && (
            <Link to="/dashboard" className="lesnoise-header__login">
              Back to dashboard
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