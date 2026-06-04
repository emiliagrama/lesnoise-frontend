import { useEffect, useState } from "react";
import AppNavbar from "../components/AppNavbar";
import api from "../lib/api";
import "./Settings.css";

export default function Settings() {
  const [user, setUser] = useState(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    api
      .get("/api/me")
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((err) => {
        console.error("LOAD USER ERROR:", err);
        setError("Could not load account details.");
      });
  }, []);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (isSaving) return;

    setError("");
    setSuccess("");

    if (password !== passwordConfirmation) {
      setError("New password and confirmation do not match.");
      return;
    }

    setIsSaving(true);

    try {
      const res = await api.patch("/api/password", {
        current_password: currentPassword,
        password,
        password_confirmation: passwordConfirmation,
      });

      setSuccess(res.data.message || "Password updated successfully.");
      setCurrentPassword("");
      setPassword("");
      setPasswordConfirmation("");
    } catch (err) {
      console.error("UPDATE PASSWORD ERROR:", err);
      console.error("UPDATE PASSWORD ERROR RESPONSE:", err.response?.data);

      const message =
        err.response?.data?.errors?.join(", ") ||
        err.response?.data?.error ||
        "Could not update password.";

      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <AppNavbar showSettings={false} />

      <main className="settings-page">
        <section className="settings-card">
          <p className="settings-eyebrow">Account settings</p>
          <h1>Settings</h1>
          <p className="settings-subtitle">
            Manage your account and security.
          </p>

          {error && <p className="settings-error">{error}</p>}
          {success && <p className="settings-success">{success}</p>}

          <div className="settings-section">
            <h2>Account</h2>

            <label>Email</label>
            <input type="email" value={user?.email || ""} disabled />
          </div>

          <form className="settings-section" onSubmit={handlePasswordUpdate}>
            <h2>Change password</h2>

            <label>Current password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />

            <label>New password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />

            <label>Confirm new password</label>
            <input
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              minLength={8}
              required
            />

            <button
              type="submit"
              className="settings-submit"
              disabled={isSaving}
            >
              {isSaving ? "Updating..." : "Update password"}
            </button>
          </form>
        </section>
      </main>
    </>
  );
}