import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../lib/api";
import "./Login.css";

export default function ResetPassword() {
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
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
      <section className="login-shell">
        <div className="login-card">
          <h2>Reset password</h2>

          <form onSubmit={handleSubmit}>
            <label>
              New password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
            </label>

            <label>
              Confirm new password
              <input
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                minLength={8}
                required
              />
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