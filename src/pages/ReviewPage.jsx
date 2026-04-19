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
        console.error("LOAD REVIEW STATUS:", err.response?.status);
        console.error("LOAD REVIEW RESPONSE:", err.response?.data);
        setError(`Failed to load review (${err.response?.status || "no status"})`);
      }
    };

    loadReview();
  }, [id, shareToken, isOwnerView]);

  const handlePageClick = (e) => {
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
      console.error("POST comment error:", err);
      console.error("FULL ERROR:", err.response?.data?.errors);
    }
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
        <h1>{review.name}</h1>
        <p style={{ color: "#6b7280" }}>{review.base_url}</p>
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
              pointerEvents: "none",
            }}
          />

          <div
            onClick={handlePageClick}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 10,
            }}
          >
            {comments.map((comment) => (
              <CommentPin
                key={comment.id}
                comment={comment}
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