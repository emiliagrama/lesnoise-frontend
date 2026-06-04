import { Link, useNavigate } from "react-router-dom";
import "../components/AppNavbar.css";

export default function AppNavbar({ showBackToDashboard = false }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="lesnoise-header">
      <div className="lesnoise-shell lesnoise-header__inner">
        <Link to="/dashboard" className="lesnoise-logo">
          lesnoise
        </Link>

        <nav className="lesnoise-header__nav">
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