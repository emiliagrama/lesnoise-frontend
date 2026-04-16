import { useEffect, useState } from "react";
import api from "../lib/api";

export default function Dashboard() {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");

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

  if (error) return <div style={{ padding: "40px" }}>{error}</div>;

  return (
    <div style={{ padding: "40px" }}>
      <h1>Dashboard</h1>

      {reviews.length === 0 ? (
        <p>No review sessions yet.</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review.id} style={{ marginBottom: "20px" }}>
              <div><strong>{review.name}</strong></div>
              <div>{review.base_url}</div>
              <div style={{ marginTop: "8px" }}>
                <a href={`/review/${review.share_token}`}>Open Review</a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}