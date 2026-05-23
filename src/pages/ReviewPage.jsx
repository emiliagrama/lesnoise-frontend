import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../lib/api";
import CommentForm from "../components/CommentForm";
import CommentPin from "../components/CommentPin";

export default function ReviewPage() {
  const { id, shareToken } = useParams();
  const isOwnerView = Boolean(id);

  const [review, setReview] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");
  const [clickPosition, setClickPosition] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [mode, setMode] = useState("browse");

  useEffect(() => {
    const loadReview = async () => {
      try {
        let reviewRes;

        if (isOwnerView) {
          reviewRes = await api.get(`/api/review_sessions/${id}`);
        } else {
          reviewRes = await api.get(`/review/${shareToken}`);
        }

        setReview(reviewRes.data);

        const commentsRes = await api.get(
          `/api/review_sessions/${reviewRes.data.id}/comments`
        );

        setComments(commentsRes.data);
      } catch (err) {
        console.error("LOAD REVIEW ERROR:", err);
        setError(`Failed to load review (${err.response?.status || "no status"})`);
      }
    };

    loadReview();
  }, [id, shareToken, isOwnerView]);

  const handlePageClick = (e) => {
    if (mode !== "comment") return;

    if (activeCommentId) {
      setActiveCommentId(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setClickPosition({ x, y });
    setShowForm(true);
  };

  const handleSubmitComment = async (data) => {
    try {
      const res = await api.post(
        `/api/review_sessions/${review.id}/comments`,
        data
      );

      setComments((prev) => [...prev, res.data]);
      setShowForm(false);
      setClickPosition(null);
      setActiveCommentId(res.data.id);
    } catch (err) {
      console.error("POST COMMENT ERROR:", err);
      console.error("POST COMMENT RESPONSE:", err.response?.data);
    }
  };

  const copyClientLink = () => {
    const shareUrl = `${window.location.origin}/review/${review.share_token}`;
    navigator.clipboard.writeText(shareUrl);
    alert("Client review link copied");
  };

  if (error) return <div>{error}</div>;
  if (!review) return <div>Loading...</div>;

  const activeComment = comments.find(
    (comment) => comment.id === activeCommentId
  );

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        background: "#f3f4f6",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          padding: "32px",
          textAlign: "center",
          borderBottom: "1px solid #e5e7eb",
          background: "#ffffff",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "6px 12px",
            borderRadius: "999px",
            background: isOwnerView ? "#111827" : "#2563eb",
            color: "white",
            fontSize: "12px",
            fontWeight: "700",
            marginBottom: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {isOwnerView ? "Owner view" : "Client view"}
        </div>

        <h1>{review.name}</h1>

        <p style={{ color: "#6b7280" }}>{review.base_url}</p>

      {isOwnerView && (
        <div
          style={{
            marginTop: "24px",
            maxWidth: "760px",
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "left",
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Install Markr on this website</h2>

          <p style={{ color: "#6b7280", lineHeight: "1.6" }}>
            Add this snippet once to the website you want reviewed. After that,
            clients can leave comments directly on the site without creating an
            account.
          </p>

          <ol style={{ color: "#374151", lineHeight: "1.8", paddingLeft: "20px" }}>
            <li>Copy the code below.</li>
            <li>Paste it before the closing <code>&lt;/body&gt;</code> tag in your main layout file.</li>
            <li>Deploy your website.</li>
            <li>Send the client review link to your client.</li>
          </ol>

          <pre
            style={{
              background: "#111827",
              color: "#e5e7eb",
              padding: "16px",
              borderRadius: "12px",
              overflowX: "auto",
              fontSize: "13px",
              lineHeight: "1.5",
            }}
          >
      {`<script src="${window.location.origin}/markr-widget.js"></script>`}
          </pre>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(
                  `<script src="${window.location.origin}/markr-widget.js"></script>`
                );
                alert("Install snippet copied");
              }}
            >
              Copy install snippet
            </button>

            <button type="button" onClick={copyClientLink}>
              Copy client review link
            </button>
          </div>

          <p style={{ color: "#6b7280", marginTop: "16px", fontSize: "14px" }}>
            Client link:
            <br />
            <code>
              {window.location.origin}/review/{review.share_token}
            </code>
          </p>
        </div>
      )}

        <div style={{ marginTop: "18px", display: "flex", justifyContent: "center", gap: "12px" }}>
          <button
            type="button"
            onClick={() => {
              setMode("browse");
              setShowForm(false);
              setClickPosition(null);
            }}
            style={{
              padding: "10px 16px",
              borderRadius: "999px",
              border: mode === "browse" ? "1px solid #111827" : "1px solid #d1d5db",
              background: mode === "browse" ? "#111827" : "#ffffff",
              color: mode === "browse" ? "#ffffff" : "#111827",
              cursor: "pointer",
              fontWeight: "700",
            }}
          >
            Browse site
          </button>

          <button
            type="button"
            onClick={() => setMode("comment")}
            style={{
              padding: "10px 16px",
              borderRadius: "999px",
              border: mode === "comment" ? "1px solid #2563eb" : "1px solid #d1d5db",
              background: mode === "comment" ? "#2563eb" : "#ffffff",
              color: mode === "comment" ? "#ffffff" : "#111827",
              cursor: "pointer",
              fontWeight: "700",
            }}
          >
            Leave comment
          </button>
        </div>

        <p style={{ color: "#6b7280", marginTop: "12px" }}>
          {mode === "browse"
            ? "Browse the website normally. Switch to comment mode when you want to leave feedback."
            : "Click anywhere on the page to leave feedback."}
        </p>
      </div>

      <div
        style={{
          padding: "40px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "900px",
            height: "80vh",
            borderRadius: "12px",
            overflow: "hidden",
            background: "#fff",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          }}
        >
          <iframe
            src={review.base_url}
            title="Reviewed website"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              pointerEvents: mode === "browse" ? "auto" : "none",
            }}
          />

          <div
            onClick={handlePageClick}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 10,
              pointerEvents: mode === "comment" ? "auto" : "none",
            }}
          >
            {comments.map((comment, index) => (
              <CommentPin
                key={comment.id}
                comment={{ ...comment, displayNumber: index + 1 }}
                isActive={activeCommentId === comment.id}
                onClick={setActiveCommentId}
              />
            ))}

            {activeComment && (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: "absolute",
                  left: `${activeComment.x_percent}%`,
                  top: `${activeComment.y_percent}%`,
                  transform: "translate(-50%, -120%)",
                  background: "white",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  padding: "12px",
                  width: "240px",
                  zIndex: 2000,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                  pointerEvents: "auto",
                }}
              >
                <div style={{ fontWeight: "bold", marginBottom: "6px" }}>
                  {activeComment.author_name}
                </div>

                <div style={{ fontSize: "14px", lineHeight: "1.4" }}>
                  {activeComment.body}
                </div>
              </div>
            )}

            {showForm && clickPosition && (
              <>
                <div
                  style={{
                    position: "absolute",
                    left: `${clickPosition.x}%`,
                    top: `${clickPosition.y}%`,
                    transform: "translate(-50%, -50%)",
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    background: "#2563eb",
                    zIndex: 1500,
                  }}
                />

                <CommentForm
                  position={clickPosition}
                  pageUrl={review.base_url}
                  onSubmit={handleSubmitComment}
                  onClose={() => {
                    setShowForm(false);
                    setClickPosition(null);
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}