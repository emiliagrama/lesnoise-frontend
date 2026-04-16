import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../lib/api";

export default function ReviewPage() {
  const { shareToken } = useParams();
  const [review, setReview] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");

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

  if (error) return <div>{error}</div>;
  if (!review) return <div>Loading...</div>;

  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1>{review.name}</h1>
      <p>{review.base_url}</p>

      <h2 style={{ marginTop: "32px" }}>Comments</h2>

      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id} style={{ marginBottom: "16px" }}>
              <strong>{comment.author_name}</strong>: {comment.body}
              <br />
              <small>
                x: {comment.x_percent}, y: {comment.y_percent}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}