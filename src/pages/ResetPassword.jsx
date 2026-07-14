import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../lib/api";
import "./Login.css";

export default function ResetPassword() {
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await api.patch("/api/reset_password", {
        token,
        password,
        password_confirmation: passwordConfirmation,
      });

      setMessage("Password reset successfully. You can now login.");
    } catch (err) {
      const backendError =
        err.response?.data?.error ||
        err.response?.data?.errors?.join(", ") ||
        "Password reset failed.";

      setError(backendError);
    }
  };

  return (
    <main className="login-page">
      <section className="login-shell forgot-shell">
        <div className="login-card">
          <h2>Reset password</h2>

          <form onSubmit={handleSubmit}>
            <label>
              New password

              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide new password" : "Show new password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <label>
              Confirm new password

              <div className="password-field">
                <input
                  type={showPasswordConfirmation ? "text" : "password"}
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  minLength={8}
                  required
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPasswordConfirmation((current) => !current)
                  }
                  aria-label={
                    showPasswordConfirmation
                      ? "Hide password confirmation"
                      : "Show password confirmation"
                  }
                  aria-pressed={showPasswordConfirmation}
                >
                  {showPasswordConfirmation ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <button type="submit">Reset password</button>
          </form>

          {message && (
            <p>
              {message} <Link to="/login">Login</Link>
            </p>
          )}

          {error && <p className="login-error">{error}</p>}
        </div>
      </section>
    </main>
  );
}