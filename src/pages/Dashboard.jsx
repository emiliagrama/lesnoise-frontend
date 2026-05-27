import { useEffect, useRef, useState } from "react";
import api from "../lib/api";

export default function Dashboard() {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const socketsRef = useRef([]);

useEffect(() => {
  if (reviews.length === 0) return;

  socketsRef.current.forEach((socket) => socket.close());
  socketsRef.current = [];

  reviews.forEach((review) => {
    const socket = new WebSocket("ws://127.0.0.1:3000/cable");

    const identifier = JSON.stringify({
      channel: "ReviewSessionChannel",
      review_session_id: review.id,
    });

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          command: "subscribe",
          identifier,
        })
      );
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (
        data.type === "welcome" ||
        data.type === "ping" ||
        data.type === "confirm_subscription"
      ) {
        return;
      }

      if (!data.message) return;

      if (typeof data.message.unresolved_comments_count !== "number") return;

      setReviews((prevReviews) =>
        prevReviews.map((currentReview) =>
          currentReview.id === review.id
            ? {
                ...currentReview,
                unresolved_comments_count:
                  data.message.unresolved_comments_count,
              }
            : currentReview
        )
      );
    };

    socket.onerror = (error) => {
      console.error("Dashboard websocket error:", error);
    };

    socketsRef.current.push(socket);
  });

  return () => {
    socketsRef.current.forEach((socket) => socket.close());
    socketsRef.current = [];
  };
}, [reviews.length]);

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

                <button
                  type="button"
                  onClick={async () => {
                    const confirmed = window.confirm(
                      "Delete this review session permanently?"
                    );

                    if (!confirmed) return;

                    try {
                      await api.delete(`/api/review_sessions/${review.id}`);

                      setReviews((prevReviews) =>
                        prevReviews.filter((r) => r.id !== review.id)
                      );
                    } catch (err) {
                      console.error("DELETE REVIEW ERROR:", err);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}