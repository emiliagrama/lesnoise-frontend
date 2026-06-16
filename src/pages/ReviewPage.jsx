import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../lib/api";
import "./ReviewPage.css";
import AppNavbar from "../components/AppNavbar";

const WIDGET_URL = import.meta.env.VITE_WIDGET_URL;

export default function ReviewPage() {
  const { id, shareToken } = useParams();
  const isDeveloperView = Boolean(id);

  const [review, setReview] = useState(null);
  const [error, setError] = useState("");
  const [copiedClientLink, setCopiedClientLink] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const loadReview = async () => {
      try {
        const reviewRes = isDeveloperView
          ? await api.get(`/api/review_sessions/${id}`)
          : await api.get(`/review/${shareToken}`);

        setReview(reviewRes.data);
      } catch (err) {
        console.error("LOAD REVIEW ERROR:", err);
        setError(`Failed to load review (${err.response?.status || "no status"})`);
      }
    };

    loadReview();
  }, [id, shareToken, isDeveloperView]);

  const copyClientLink = async () => {
    try {
      const shareUrl = `${window.location.origin}/review/${review.slug}`;
      await navigator.clipboard.writeText(shareUrl);

      setCopiedClientLink(true);
      setTimeout(() => setCopiedClientLink(false), 2000);
    } catch (err) {
      console.error("COPY CLIENT LINK ERROR:", err);
    }
  };

const copyInstallSnippet = async () => {
  try {
    await navigator.clipboard.writeText(installSnippet);

    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  } catch (err) {
    console.error("COPY SNIPPET ERROR:", err);
  }
};

  if (error) {
    return <div className="review-state">{error}</div>;
  }

  if (!review) {
    return <div className="review-state">Loading review...</div>;
  }

  const clientReviewLink = `${window.location.origin}/review/${review.slug}`;

  const reviewUrl = `${review.base_url}?lesnoise_review=${review.slug}&lesnoise_role=${isDeveloperView ? "developer" : "client"}`;
  const installSnippet = `<script>
    window.LesnoiseConfig = {
      apiUrl: "${import.meta.env.VITE_API_URL}",
      cableUrl: "${import.meta.env.VITE_API_URL.replace("https://", "wss://")}/cable"
    };
  </script>

  <script crossorigin src="${WIDGET_URL}"></script>

  <script>
    const lesnoiseParams = new URLSearchParams(window.location.search);
    const lesnoiseReviewToken = lesnoiseParams.get("lesnoise_review");

    if (lesnoiseReviewToken) {
      Lesnoise.init({
        reviewToken: lesnoiseReviewToken
      });
    }
  </script>`;

  return (
    <main className="review-page">
      {isDeveloperView && <AppNavbar
        showSettings={false}
        showBackArrow={true}
      />}
      <header className="review-header">
        <div className="review-shell review-header__inner">
          <div className="review-view-badge">
            {isDeveloperView ? "Developer view" : "Client view"}
          </div>

          <h1>{review.name}</h1>

          <p className="review-url">{review.base_url}</p>

          {!isDeveloperView && (
            <div className="review-client-help">
              <div className="review-client-help__icon">💬</div>

              <strong>Leave Feedback</strong>

              <p>
                Click anywhere on the page to leave feedback.
                Request changes, report issues, or share ideas directly on the website.
              </p>
            </div>
          )}

          {isDeveloperView && (
            <section className="review-install-card">
              <button
                type="button"
                className="review-install-toggle"
                onClick={() => setShowInstall((prev) => !prev)}
              >
                <h2>Install Lesnoise on this website</h2>
                <span>{showInstall ? "Hide" : "Show"}</span>
              </button>

              {showInstall && (
                <div className="review-install-content">
                  <div className="review-install-card__content">
                    <div>
                      <p>
                        Paste the snippet below into the website you want to review.
                      </p>

                      <ul className="review-install-list">
                        <li>
                          Static HTML websites → before <code>{"</body>"}</code>
                        </li>

                        <li>
                          React / Vite projects → <code>public/index.html</code> before{" "}
                          <code>{"</body>"}</code>
                        </li>

                        <li>
                          Rails applications → <code>app/views/layouts/application.html.erb</code>{" "}
                          before <code>{"</body>"}</code>
                        </li>

                        <li>
                          Next.js applications → <code>layout.tsx</code> or{" "}
                          <code>_document.js</code> before <code>{"</body>"}</code>
                        </li>
                      </ul>

                      <p>
                        Once installed, comments stay attached to the real page while scrolling.
                      </p>
                    </div>
                  </div>

<pre className="review-code-block">
  {installSnippet}
</pre>

                  <button
                    type="button"
                    className="review-button review-button--primary review-copy-button"
                    onClick={copyInstallSnippet}
                  >
                    {copiedSnippet ? "Snippet copied" : "Copy install snippet"}
                  </button>

                  <div className="review-client-link">
                    <span>Client review link</span>

                    <code>{clientReviewLink}</code>

                    <button
                      type="button"
                      className="review-button review-button--ghost review-copy-button"
                      onClick={copyClientLink}
                    >
                      {copiedClientLink ? "Client link copied" : "Copy client link"}
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </header>

      <section className="review-preview-section">
        <div className="review-shell">
          <div className="review-preview-topbar">
            <span></span>
            <span></span>
            <span></span>
            <p>{review.base_url}</p>
          </div>

          <div className="review-preview-frame">
            <iframe
              id="lesnoise-review-iframe"
              src={reviewUrl}
              title="Reviewed website"
            />
          </div>
        </div>
      </section>
    </main>
  );
}