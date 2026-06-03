import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../lib/api";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/api/login", { email, password });

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      console.error("LOGIN ERROR RESPONSE:", err.response?.data);
      setError("Invalid email or password.");
    }
  };

  return (
    <main className="login-page">
      <nav className="login-nav">
        <Link to="/" className="login-logo">lesnoise</Link>
        <Link to="/signup" className="login-nav-btn">Sign up</Link>
      </nav>

      <section className="login-shell">
        <div className="login-copy">
          <p className="login-eyebrow">Welcome back</p>
          <h1>Login to your review workspace.</h1>
          <p>
            Continue managing feedback, comments, and client review sessions.
          </p>
        </div>

        <div className="login-card">
          <h2>Login</h2>

          <form onSubmit={handleSubmit}>
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

            <p style={{ textAlign: "right", marginBottom: "1rem" }}>
              <Link to="/forgot-password">
                Forgot password?
              </Link>
            </p>

            <button type="submit">Login</button>

            {error && <p className="login-error">{error}</p>}
          </form>
        </div>
      </section>
    </main>
  );
}