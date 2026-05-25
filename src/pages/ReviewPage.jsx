import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../lib/api";

export default function ReviewPage() {
  const { id, shareToken } = useParams();
  const isDeveloperView = Boolean(id);

  const [review, setReview] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReview = async () => {
      try {
        const reviewRes = isDeveloperView
          ? await api.get(`/api/review_sessions/${id}`)
          : await api.get(`/review/${shareToken}`);

        setReview(reviewRes.data);
      } catch (err) {
        console.error("LOAD REVIEW ERROR:", err);

        setError(
          `Failed to load review (${err.response?.status || "no status"})`
        );
      }
    };

    loadReview();
  }, [id, shareToken, isDeveloperView]);

  const copyClientLink = () => {
    const shareUrl = `${window.location.origin}/review/${review.share_token}`;

    navigator.clipboard.writeText(shareUrl);

    alert("Client review link copied");
  };

  const copyInstallSnippet = () => {
    const snippet = `<script src="${window.location.origin}/lesnoise-widget.js"></script>

<script>
  Lesnoise.init({
    reviewToken: "${review.share_token}"
  });
</script>`;

    navigator.clipboard.writeText(snippet);

    alert("Install snippet copied");
  };

  const setWidgetMode = (mode) => {
    const iframe = document.getElementById(
      "lesnoise-review-iframe"
    );

    if (!iframe || !iframe.contentWindow) return;

    iframe.contentWindow.postMessage(
      {
        type: "LESNOISE_MODE",
        mode,
      },
      "*"
    );
  };

  if (error) return <div>{error}</div>;

  if (!review) return <div>Loading...</div>;

  const reviewUrl = `${review.base_url}?lesnoise_review=${review.share_token}`;

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
            background: isDeveloperView
              ? "#111827"
              : "#2563eb",
            color: "white",
            fontSize: "12px",
            fontWeight: "700",
            marginBottom: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {isDeveloperView
            ? "Developer view"
            : "Client view"}
        </div>

        <h1>{review.name}</h1>

        <p style={{ color: "#6b7280" }}>
          {review.base_url}
        </p>

        {isDeveloperView && (
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
            <h2 style={{ marginTop: 0 }}>
              Install Lesnoise on this website
            </h2>

            <p
              style={{
                color: "#6b7280",
                lineHeight: "1.6",
              }}
            >
              For comments to stay glued to the
              real page while scrolling, the
              widget must be installed inside the
              reviewed website.
            </p>

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
{`<script src="${window.location.origin}/lesnoise-widget.js"></script>

<script>
  Lesnoise.init({
    reviewToken: "${review.share_token}"
  });
</script>`}
            </pre>

            <button
              type="button"
              onClick={copyInstallSnippet}
            >
              Copy install snippet
            </button>

            <p
              style={{
                color: "#6b7280",
                marginTop: "16px",
                fontSize: "14px",
              }}
            >
              Client link:
              <br />
              <code>
                {window.location.origin}/review/
                {review.share_token}
              </code>
            </p>

            <button
              type="button"
              onClick={copyClientLink}
            >
              Copy client review link
            </button>
          </div>
        )}
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
            width: "90vw",
            maxWidth: "1200px",
            height: "80vh",
            borderRadius: "12px",
            overflow: "hidden",
            background: "#fff",
            boxShadow:
              "0 10px 40px rgba(0,0,0,0.1)",
          }}
        >
          <iframe
            id="lesnoise-review-iframe"
            src={reviewUrl}
            title="Reviewed website"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
}