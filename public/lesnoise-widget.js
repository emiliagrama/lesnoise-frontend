(function () {
  const API_URL = "http://localhost:3000";

  let reviewToken = null;
  let review = null;
  let mode = "browse";
  let comments = [];

  window.Lesnoise = window.Lesnoise || {};

  window.Lesnoise.init = function (options = {}) {
    reviewToken = options.reviewToken;

    if (!reviewToken) {
      console.warn("Lesnoise: missing reviewToken");
      return;
    }

    boot();
  };

  const params = new URLSearchParams(window.location.search);
  const tokenFromUrl = params.get("lesnoise_review");

  if (tokenFromUrl) {
    reviewToken = tokenFromUrl;
    boot();
  }

  function boot() {
    if (document.getElementById("lesnoise-toolbar")) return;

    createToolbar();
    createOverlay();
    setMode("browse");
    loadReviewAndComments();
  }

  let toolbar;
  let overlay;

  function createToolbar() {
    toolbar = document.createElement("div");
    toolbar.id = "lesnoise-toolbar";
    toolbar.style.position = "fixed";
    toolbar.style.top = "20px";
    toolbar.style.right = "20px";
    toolbar.style.zIndex = "999999";
    toolbar.style.background = "#111827";
    toolbar.style.color = "white";
    toolbar.style.padding = "12px";
    toolbar.style.borderRadius = "999px";
    toolbar.style.fontFamily = "Arial, sans-serif";
    toolbar.style.display = "flex";
    toolbar.style.gap = "8px";

    const browseBtn = document.createElement("button");
    browseBtn.innerText = "Browse";
    browseBtn.style.padding = "8px 12px";

    const commentBtn = document.createElement("button");
    commentBtn.innerText = "Comment";
    commentBtn.style.padding = "8px 12px";

    browseBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      setMode("browse");
    });

    commentBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      setMode("comment");
    });

    toolbar.appendChild(browseBtn);
    toolbar.appendChild(commentBtn);
    document.body.appendChild(toolbar);
  }

  function createOverlay() {
    overlay = document.createElement("div");
    overlay.id = "lesnoise-overlay";
    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = `${document.documentElement.scrollHeight}px`;
    overlay.style.zIndex = "999998";
    overlay.style.pointerEvents = "none";

    overlay.addEventListener("click", handleOverlayClick);

    document.body.appendChild(overlay);
  }

  function setMode(newMode) {
    mode = newMode;
    overlay.style.pointerEvents = mode === "comment" ? "auto" : "none";
    document.body.style.cursor = mode === "comment" ? "crosshair" : "default";
  }

  async function loadReviewAndComments() {
    try {
      const reviewRes = await fetch(`${API_URL}/review/${reviewToken}`);
      review = await reviewRes.json();

      const commentsRes = await fetch(
        `${API_URL}/api/review_sessions/${review.id}/comments`
      );

      comments = await commentsRes.json();
      updateOverlaySize();
      renderComments();
    } catch (err) {
      console.error("Lesnoise: failed to load review/comments", err);
    }
  }

  function renderPin(comment, index) {
    const pin = document.createElement("button");
    pin.className = "lesnoise-pin";
    pin.innerText = String(index + 1);

    pin.style.position = "absolute";
    pin.style.left = `${comment.x_percent}%`;
    pin.style.top = `${comment.y_document}px`;
    pin.style.transform = "translate(-50%, -50%)";
    pin.style.width = "28px";
    pin.style.height = "28px";
    pin.style.borderRadius = "50%";
    pin.style.border = "none";
    pin.style.background = "#2563eb";
    pin.style.color = "white";
    pin.style.fontWeight = "700";
    pin.style.cursor = "pointer";
    pin.style.zIndex = "999999";

    pin.addEventListener("click", function (e) {
      e.stopPropagation();
      alert(`${comment.author_name}: ${comment.body}`);
    });

    overlay.appendChild(pin);
  }

  function renderComments() {
    overlay.querySelectorAll(".lesnoise-pin").forEach((pin) => pin.remove());

    comments.forEach((comment, index) => {
      if (comment.page_path === window.location.pathname) {
        renderPin(comment, index);
      }
    });
  }

  async function handleOverlayClick(e) {
    if (mode !== "comment") return;

    const body = prompt("Write your comment:");
    if (!body) return;

    const xPercent = (e.pageX / document.documentElement.scrollWidth) * 100;
    const yDocument = e.pageY;

    try {
      const res = await fetch(
        `${API_URL}/api/review_sessions/${review.id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment: {
              body,
              author_name: "Client",
              page_url: window.location.href,
              page_path: window.location.pathname,
              x_percent: xPercent,
              y_percent: (e.pageY / document.documentElement.scrollHeight) * 100,
              y_document: yDocument,
              viewport_width: window.innerWidth,
              viewport_height: window.innerHeight,
            },
          }),
        }
      );

      const savedComment = await res.json();

      comments.push(savedComment);
      renderComments();
      setMode("browse");
    } catch (err) {
      console.error("Lesnoise: failed to save comment", err);
    }
  }

  function updateOverlaySize() {
    overlay.style.height = `${document.documentElement.scrollHeight}px`;
  }

  window.addEventListener("resize", function () {
    updateOverlaySize();
    renderComments();
  });
})();