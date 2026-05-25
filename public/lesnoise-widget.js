(function () {
  const API_URL = "http://localhost:3000";

  let reviewToken = null;
  let review = null;
  let mode = "browse";
  let comments = [];

  window.Lesnoise = window.Lesnoise || {};

  window.Lesnoise.init = function (options = {}) {
    reviewToken = options.reviewToken;
    if (!reviewToken) return console.warn("Lesnoise: missing reviewToken");
    boot();
  };

  const params = new URLSearchParams(window.location.search);
  const tokenFromUrl = params.get("lesnoise_review");

  if (tokenFromUrl) {
    reviewToken = tokenFromUrl;
    boot();
  }

  function boot() {
    document.addEventListener("click", handlePageClick, true);
    setMode("browse");
    loadReviewAndComments();
  }

  function setMode(newMode) {
    mode = newMode;
    document.body.style.cursor = mode === "comment" ? "crosshair" : "default";
  }

  window.addEventListener("message", function (event) {
    if (event.data && event.data.type === "LESNOISE_MODE") {
      setMode(event.data.mode);
    }
  });

  async function loadReviewAndComments() {
    try {
      const reviewRes = await fetch(`${API_URL}/review/${reviewToken}`);
      review = await reviewRes.json();

      const commentsRes = await fetch(
        `${API_URL}/api/review_sessions/${review.id}/comments`
      );

      comments = await commentsRes.json();
      renderComments();
    } catch (err) {
      console.error("Lesnoise: failed to load review/comments", err);
    }
  }

  function getElementSelector(el) {
    if (!el || el === document.body) return "body";
    if (el.id) return `#${el.id}`;

    const path = [];

    while (el && el.nodeType === Node.ELEMENT_NODE && el !== document.body) {
      let selector = el.nodeName.toLowerCase();

      if (el.className && typeof el.className === "string") {
        const className = el.className.trim().split(/\s+/)[0];
        if (className) selector += `.${className}`;
      }

      path.unshift(selector);
      el = el.parentElement;
    }

    return path.join(" > ");
  }

  function renderComments() {
    document.querySelectorAll(".lesnoise-pin").forEach((pin) => pin.remove());

    comments.forEach((comment, index) => {
      if (comment.page_path !== window.location.pathname) return;

      const target = document.querySelector(comment.element_selector);
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const pin = document.createElement("button");

      pin.className = "lesnoise-pin";
      pin.innerText = String(index + 1);

      pin.style.position = "absolute";
      pin.style.left = `${
        window.scrollX + rect.left + Number(comment.x_element)
      }px`;
      pin.style.top = `${
        window.scrollY + rect.top + Number(comment.y_element)
      }px`;
      pin.style.transform = "translate(-50%, -50%)";
      pin.style.width = "28px";
      pin.style.height = "28px";
      pin.style.borderRadius = "50%";
      pin.style.border = "none";
      pin.style.background = "#2563eb";
      pin.style.color = "white";
      pin.style.fontWeight = "700";
      pin.style.cursor = "pointer";
      pin.style.zIndex = "999998";
      pin.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";

      pin.addEventListener("click", function (e) {
        e.stopPropagation();
        showCommentCard(comment, pin);
      });

      document.body.appendChild(pin);
    });
  }

  function showCommentCard(comment, pin) {
    document
      .querySelectorAll(".lesnoise-comment-card")
      .forEach((card) => card.remove());

    const rect = pin.getBoundingClientRect();

    const card = document.createElement("div");
    card.className = "lesnoise-comment-card";

    card.innerHTML = `
      <div style="font-weight: 700; margin-bottom: 6px;">
        ${comment.author_name || "Client"}
      </div>
      <div style="font-size: 14px; line-height: 1.4;">
        ${comment.body}
      </div>
    `;

    card.style.position = "absolute";
    card.style.left = `${window.scrollX + rect.left + 36}px`;
    card.style.top = `${window.scrollY + rect.top - 8}px`;
    card.style.width = "240px";
    card.style.background = "white";
    card.style.color = "#111827";
    card.style.border = "1px solid #e5e7eb";
    card.style.borderRadius = "12px";
    card.style.padding = "12px";
    card.style.zIndex = "999999";
    card.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
    card.style.fontFamily = "Arial, sans-serif";

    document.body.appendChild(card);
  }

  async function handlePageClick(e) {
    if (mode !== "comment") return;

    e.preventDefault();
    e.stopPropagation();

    const target = document.elementFromPoint(e.clientX, e.clientY);
    if (!target) return;

    const body = prompt("Write your comment:");
    if (!body) return;

    const rect = target.getBoundingClientRect();
    const elementSelector = getElementSelector(target);

    const xElement = e.clientX - rect.left;
    const yElement = e.clientY - rect.top;

    try {
      const res = await fetch(
        `${API_URL}/api/review_sessions/${review.id}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            comment: {
              body,
              author_name: "Client",
              page_url: window.location.href,
              page_path: window.location.pathname,
              x_percent: (e.pageX / document.documentElement.scrollWidth) * 100,
              y_percent:
                (e.pageY / document.documentElement.scrollHeight) * 100,
              x_document: e.pageX,
              y_document: e.pageY,
              element_selector: elementSelector,
              x_element: xElement,
              y_element: yElement,
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

  window.addEventListener("resize", renderComments);
  window.addEventListener("scroll", renderComments);
  window.addEventListener("load", renderComments);
})();