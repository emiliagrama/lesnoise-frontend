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
        transform: "translate(-50%, -50%)",
        width: "22px",
        height: "22px",
        borderRadius: "999px",
        border: "none",
        background: isActive ? "#1d4ed8" : "#2563eb",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "11px",
        fontWeight: "bold",
        zIndex: 1100,
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      }}
      title=""
    >
      {comment.id}
    </button>
  );
}