import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../lib/api";
import CommentForm from "../components/CommentForm";
import CommentPin from "../components/CommentPin";

export default function ReviewPage() {
  const { shareToken } = useParams();

  const [review, setReview] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");
  const [clickPosition, setClickPosition] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [activeCommentId, setActiveCommentId] = useState(null);

  useEffect(() => {
    api
      .get(`/review/${shareToken}`)
      .then((res) => {
        setReview(res.data);
        return api.get(`/api/review_sessions/${res.data.id}/comments`);
      })
      .then((res) => {
        setComments(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load review");
      });
  }, [shareToken]);

  const handlePageClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setActiveCommentId(null);
    setClickPosition({ x, y });
    setShowForm(true);
  };

  const handleSubmitComment = async (data) => {
    try {
      const res = await api.post(
        `/api/review_sessions/${review.id}/comments`,
        data
      );

      console.log("POST comment response:", res.data);

      setComments((prev) => [...prev, res.data]);
      setShowForm(false);
      setClickPosition(null);
      setActiveCommentId(null);
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
  <div style={{ fontFamily: "Arial, sans-serif" }}>
    
    {/* HEADER */}
    <div
      style={{
        padding: "32px",
        textAlign: "center",
        borderBottom: "1px solid #e5e7eb",
        background: "#ffffff"
      }}
    >
      <h1>{review.name}</h1>
      <p style={{ color: "#6b7280" }}>{review.base_url}</p>
    </div>

    {/* CANVAS */}
    <div
      onClick={handlePageClick}
      style={{
        position: "relative",
        minHeight: "80vh",
        background: "#f3f4f6",
        display: "flex",
        justifyContent: "center",
        padding: "40px"
      }}
    >
      {/* FAKE PAGE SURFACE */}
      <div
        style={{
          width: "900px",
          minHeight: "600px",
          background: "white",
          borderRadius: "8px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          position: "relative",
          overflow: "hidden"
        }}
      >

        {/* PINS */}
        {comments.map((comment) => (
          <CommentPin
            key={comment.id}
            comment={comment}
            isActive={activeCommentId === comment.id}
            onClick={setActiveCommentId}
          />
        ))}

        {/* ACTIVE COMMENT POPUP */}
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
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)"
            }}
          >
            <div style={{ fontWeight: "bold", marginBottom: "6px" }}>
              {activeComment.author_name}
            </div>
            <div style={{ fontSize: "14px" }}>
              {activeComment.body}
            </div>
          </div>
        )}

        {/* FORM */}
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
                zIndex: 1500
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
);
}