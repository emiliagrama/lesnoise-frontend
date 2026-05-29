import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../lib/api";
import "./Signup.css";

export default function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/api/signup", {
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("SIGNUP ERROR:", err);
      console.error("SIGNUP ERROR RESPONSE:", err.response?.data);

      const backendError =
        err.response?.data?.errors?.join(", ") ||
        err.response?.data?.error ||
        "Signup failed.";

      setError(backendError);
    }
  };

  return (
    <main className="signup-page">
      <nav className="signup-nav">
        <Link to="/" className="signup-logo">lesnoise</Link>
        <Link to="/login" className="signup-nav-link">Login</Link>
      </nav>

      <section className="signup-shell">
        <div className="signup-copy">
          <p className="signup-eyebrow">Start reviewing faster</p>
          <h1>Create your feedback workspace.</h1>
          <p>
            Create review sessions, share links with clients, and keep comments
            attached exactly where they belong.
          </p>
        </div>

        <div className="signup-card">
          <h2>Create account</h2>

          <form onSubmit={handleSignup}>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@email.com"
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </label>

            <label>
              Confirm password
              <input
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                placeholder="••••••••"
              />
            </label>

            <button type="submit">Sign up</button>

            {error && <p className="signup-error">{error}</p>}
          </form>

          <p className="signup-switch">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </section>
    </main>
  );
}