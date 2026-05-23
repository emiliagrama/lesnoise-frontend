(function () {
  const params = new URLSearchParams(window.location.search);
  const reviewToken = params.get("markr_review");

  if (!reviewToken) return;

  const API_URL = "http://localhost:3000";

  let mode = "browse";
  let comments = [];

  const toolbar = document.createElement("div");
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

  toolbar.appendChild(browseBtn);
  toolbar.appendChild(commentBtn);
  document.body.appendChild(toolbar);

  const overlay = document.createElement("div");
  overlay.style.position = "absolute";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = `${document.documentElement.scrollHeight}px`;
  overlay.style.zIndex = "999998";
  overlay.style.pointerEvents = "none";
  document.body.appendChild(overlay);

  function setMode(newMode) {
    mode = newMode;
    overlay.style.pointerEvents = mode === "comment" ? "auto" : "none";
    document.body.style.cursor = mode === "comment" ? "crosshair" : "default";
  }

  browseBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    setMode("browse");
  });

  commentBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    setMode("comment");
  });

  function renderPin(comment, index) {
    const pin = document.createElement("button");
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

    overlay.appendChild(pin);
  }

  function renderComments() {
    overlay.querySelectorAll("button").forEach((btn) => btn.remove());

    comments.forEach((comment, index) => {
      if (comment.page_path === window.location.pathname) {
        renderPin(comment, index);
      }
    });
  }

  async function loadComments() {
    const reviewRes = await fetch(`${API_URL}/review/${reviewToken}`);
    const review = await reviewRes.json();

    const commentsRes = await fetch(
      `${API_URL}/api/review_sessions/${review.id}/comments`
    );

    comments = await commentsRes.json();
    renderComments();
  }

  overlay.addEventListener("click", async function (e) {
    if (mode !== "comment") return;

    const body = prompt("Write your comment:");
    if (!body) return;

    const xPercent = (e.pageX / document.documentElement.scrollWidth) * 100;
    const yDocument = e.pageY;

    const reviewRes = await fetch(`${API_URL}/review/${reviewToken}`);
    const review = await reviewRes.json();

    const res = await fetch(`${API_URL}/api/review_sessions/${review.id}/comments`, {
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
          y_document: yDocument,
          viewport_width: window.innerWidth,
          viewport_height: window.innerHeight,
        },
      }),
    });

    const savedComment = await res.json();
    comments.push(savedComment);
    renderComments();
  });

  window.addEventListener("resize", function () {
    overlay.style.height = `${document.documentElement.scrollHeight}px`;
    renderComments();
  });

  setMode("browse");
  loadComments();
})();