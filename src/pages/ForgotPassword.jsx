import { useState } from "react";
import api from "../lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/forgot_password", {
        email,
        frontend_url: window.location.origin
      });

    setMessage(
      "Password reset instructions have been sent.\n\nPlease check your email inbox and spam folder, then follow the reset link."
    );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="login-page">
      <section className="login-shell">
        <div className="login-card">
          <h2>Forgot password</h2>

          <form onSubmit={handleSubmit}>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <button type="submit">
              Send reset link
            </button>
          </form>

          {message && (
            <p className="forgot-success">
              {message}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}