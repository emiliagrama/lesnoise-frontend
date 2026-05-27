import { useEffect, useState } from "react";
import api from "../lib/api";

export default function Dashboard() {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    api
      .get("/api/review_sessions")
      .then((res) => {
        console.log("DASHBOARD RESPONSE:", res.data);
        setReviews(res.data);
      })
      .catch((err) => {
        console.error("DASHBOARD ERROR:", err);
        console.error("DASHBOARD ERROR RESPONSE:", err.response?.data);
        console.error("DASHBOARD ERROR STATUS:", err.response?.status);
        setError(`Failed to load reviews (${err.response?.status || "no status"})`);
      });
  }, []);

  const handleCreateReview = async (e) => {
    e.preventDefault();

    try {
      const projectRes = await api.post("/api/projects", {
        name,
        base_url: baseUrl,
      });

      const project = projectRes.data;

      const reviewRes = await api.post(
        `/api/projects/${project.id}/review_sessions`,
        {
          name,
          base_url: baseUrl,
        }
      );

      setReviews((prev) => [...prev, reviewRes.data]);
      setName("");
      setBaseUrl("");
    } catch (err) {
      console.error("CREATE REVIEW ERROR:", err);
      console.error("CREATE REVIEW ERROR RESPONSE:", err.response?.data);
    }
  };

  if (error) return <div style={{ padding: "40px" }}>{error}</div>;

  return (
    <div style={{ padding: "40px" }}>
      <h1>Dashboard</h1>

      <form onSubmit={handleCreateReview} style={{ marginBottom: "30px" }}>
        <h2>Create Review</h2>

        <input
          placeholder="Review name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ display: "block", marginBottom: "10px" }}
        />

        <input
          placeholder="Base URL"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          required
          style={{ display: "block", marginBottom: "10px" }}
        />

        <button type="submit">Create</button>
      </form>

      {reviews.length === 0 ? (
        <p>No review sessions yet.</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review.id} style={{ marginBottom: "20px" }}>
              <div>
                <strong>{review.name}</strong>
              </div>
              <div>{review.base_url}</div>
              {review.unresolved_comments_count > 0 && (
                <div style={{ marginTop: "6px", fontSize: "14px", fontWeight: "600" }}>
                  {review.unresolved_comments_count} unresolved
                </div>
              )}
              <div style={{ marginTop: "8px", display: "flex", gap: "12px", alignItems: "center" }}>
                <a href={`/reviews/${review.id}`}>Open Review</a>

                <button
                  type="button"
                  onClick={() => {
                    const shareUrl = `${window.location.origin}/review/${review.share_token}`;
                    navigator.clipboard.writeText(shareUrl);
                  }}
                >
                  Copy Share Link
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}