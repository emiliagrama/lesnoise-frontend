import { useState } from "react";

export default function CommentForm({ position, pageUrl, onSubmit, onClose }) {
  const [content, setContent] = useState("");

  const safeX = Math.min(Math.max(position.x, 15), 85);
  const safeY = Math.min(Math.max(position.y, 15), 85);

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      body: content,
      author_name: "Client",
      page_url: pageUrl,
      x_percent: position.x,
      y_percent: position.y,
    });

    setContent("");
  };

  return (
    <div
      style={{
        position: "absolute",
        left: `${safeX}%`,
        top: `${safeY}%`,
        transform: "translate(-50%, -120%)",
        background: "white",
        border: "1px solid #ccc",
        borderRadius: "6px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        padding: "10px",
        zIndex: 2000,
        width: "220px",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          required
          style={{
            width: "100%",
            minHeight: "70px",
            resize: "vertical",
            boxSizing: "border-box",
          }}
        />

        <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
          <button type="submit">Send</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}