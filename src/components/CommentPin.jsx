export default function CommentPin({ comment, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick(comment.id);
      }}
      style={{
        position: "absolute",
        left: `${comment.x_percent}%`,
        top: `${comment.y_percent}%`,
        transform: `translate(-50%, -50%) scale(${isActive ? 1.2 : 1})`,
        width: "26px",
        height: "26px",
        borderRadius: "999px",
        border: isActive ? "2px solid #111827" : "none",
        background: isActive ? "#111827" : "#2563eb",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "12px",
        fontWeight: "bold",
        zIndex: 1100,
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        transition: "transform 160ms ease, background 160ms ease, border 160ms ease",
      }}
      title=""
    >
      {comment.id}
    </button>
  );
}