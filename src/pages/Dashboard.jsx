import { useEffect, useRef, useState } from "react";
import api from "../lib/api";
import "./Dashboard.css";
import AppNavbar from "../components/AppNavbar";

export default function Dashboard() {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const socketsRef = useRef([]);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reviewToRename, setReviewToRename] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);

useEffect(() => {
  if (reviews.length === 0) return;

  socketsRef.current.forEach((socket) => socket.close());
  socketsRef.current = [];

  reviews.forEach((review) => {
    const socket = new WebSocket(import.meta.env.VITE_CABLE_URL);

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

    if (isCreating) return;
    setError("");     
    setIsCreating(true);

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

        const message =
          err.response?.data?.errors?.join(", ") ||
          err.response?.data?.error ||
          "Could not create review. Please try again.";

        setError(message);
      } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!reviewToDelete || isDeleting) return;

    setIsDeleting(true);

    try {
      await api.delete(`/api/review_sessions/${reviewToDelete.id}`);

      setReviews((prevReviews) =>
        prevReviews.filter((review) => review.id !== reviewToDelete.id)
      );

      setReviewToDelete(null);
    } catch (err) {
      console.error("DELETE REVIEW ERROR:", err);
    } finally {
      setIsDeleting(false);
    }
  };

const handleRenameReview = async (e) => {
  e.preventDefault();

  if (!reviewToRename || isRenaming) return;

  const cleanName = renameValue.trim();

  if (!cleanName) {
    setError("Review name cannot be empty.");
    return;
  }

  setIsRenaming(true);
  setError("");

  try {
    const res = await api.patch(`/api/review_sessions/${reviewToRename.id}`, {
      name: cleanName,
    });

    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === reviewToRename.id ? res.data : review
      )
    );

    setReviewToRename(null);
    setRenameValue("");
  } catch (err) {
    console.error("RENAME REVIEW ERROR:", err);

    const message =
      err.response?.data?.errors?.join(", ") ||
      err.response?.data?.error ||
      "Could not rename review.";

    setError(message);
  } finally {
    setIsRenaming(false);
  }
};

  const totalReviews = reviews.length;

return (
  <div className="dashboard-page">
    <AppNavbar />
    <div className="dashboard-shell">
      <div className="dashboard-topbar">
        <div>
          <p className="dashboard-eyebrow">
            REVIEW WORKSPACE
          </p>

          <h1 className="dashboard-title">
            Dashboard
          </h1>

          <p className="dashboard-subtitle">
            Create review sessions, track unresolved
            feedback, and collaborate directly on live websites.
          </p>
        </div>
      </div>
      
      <div className="dashboard-stats">
        <div className="dashboard-stat-card">
          <span>{totalReviews}</span>
          <p>Review sessions</p>
        </div>

        <div className="dashboard-stat-card">
          <span>
            {reviews.filter(
              review => (review.unresolved_comments_count || 0) > 0
            ).length}
          </span>
          <p>Need attention</p>
        </div>

        <div className="dashboard-stat-card">
          <span>
            {reviews.filter(
              review => (review.unresolved_comments_count || 0) === 0
            ).length}
          </span>
          <p>Resolved reviews</p>
        </div>
      </div>

      <div className="dashboard-create-card">
        <div className="dashboard-create-header">
          <h2>Create review</h2>

          <p>
            Start a new review session for a website.
          </p>
        </div>

        <form
          onSubmit={handleCreateReview}
          className="dashboard-form"
        >
          <input
            className="dashboard-input"
            placeholder="Review name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={30}
            required
            disabled={isCreating}
          />

          <input
            className="dashboard-input"
            placeholder="Base URL"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            required
            disabled={isCreating}
          />
{error && (
  <p className="dashboard-form-error">
    {error}
  </p>
)}
          <button
            className="dashboard-button dashboard-button--primary"
            type="submit"
            disabled={isCreating}
          >
            {isCreating ? "Creating..." : "Create review"}
          </button>
        </form>
      </div>

      {reviews.length === 0 ? (
        <div className="dashboard-empty">
          No review sessions yet.
        </div>
      ) : (
        <div className="dashboard-grid">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="dashboard-card"
            >
              <div className="dashboard-card__content">
                <div className="dashboard-card__top">
                  <div>
                    <h3>{review.name}</h3>

                    <p>{review.base_url}</p>
                  </div>

                
                  <div className="dashboard-card__meta">
                    <span
                      className={
                        review.unresolved_comments_count > 0
                          ? "dashboard-unresolved-warning"
                          : ""
                      }
                    >
                      {review.unresolved_comments_count || 0} unresolved comments
                    </span>
                  </div>
                </div>

                <div className="dashboard-card__actions">
                  <a
                    href={`/reviews/${review.id}`}
                    className="dashboard-button dashboard-button--primary"
                  >
                    Open review
                  </a>

                  <button
                    type="button"
                    className="dashboard-button dashboard-button--ghost"
                    onClick={() => {
                      setReviewToRename(review);
                      setRenameValue(review.name);
                    }}
                  >
                    Rename
                  </button>

                  <button
                    type="button"
                    className="dashboard-button dashboard-button--ghost"
                    
                    onClick={() => setReviewToDelete(review)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {reviewToRename && (
        <div className="dashboard-modal-backdrop">
          <div className="dashboard-modal">
            <h2>Rename review session</h2>

            <form onSubmit={handleRenameReview}>
              <input
                type="text"
                className="dashboard-input"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                maxLength={30}
                autoFocus
              />

              <div className="dashboard-modal__actions">
                <button
                  type="button"
                  className="dashboard-button dashboard-button--ghost"
                  onClick={() => {
                    setReviewToRename(null);
                    setRenameValue("");
                  }}
                  disabled={isRenaming}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="dashboard-button dashboard-button--primary"
                  disabled={isRenaming}
                >
                  {isRenaming ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {reviewToDelete && (
        <div className="dashboard-modal-backdrop">
          <div className="dashboard-modal">
            <h2>Delete review session?</h2>

            <p>
              This will permanently delete{" "}
              <strong>{reviewToDelete.name}</strong>
              {" "}and all its comments.
            </p>

            <div className="dashboard-modal__actions">
              <button
                type="button"
                className="dashboard-button dashboard-button--ghost"
                onClick={() => setReviewToDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="dashboard-button dashboard-button--danger"
                onClick={handleDeleteReview}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    <div className="dashboard-support">
      <p>Need help or want to report a bug?</p>
      <a href="mailto:support@lesnoise.com">
        support@lesnoise.com
      </a>
    </div>
  </div>
);
}