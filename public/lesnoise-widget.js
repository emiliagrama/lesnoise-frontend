(function () {
  const API_URL = "http://localhost:3000";
  const CABLE_URL = "ws://127.0.0.1:3000/cable";

  let reviewToken = null;
  let review = null;
  let mode = "comment";
  let comments = [];
  let cableSocket = null;
  let cableIdentifier = null;

  window.Lesnoise = window.Lesnoise || {};

  window.Lesnoise.init = function (options = {}) {
    reviewToken = options.reviewToken;

    if (!reviewToken) {
      return console.warn("Lesnoise: missing reviewToken");
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
    document.addEventListener("click", handlePageClick, true);
    document.addEventListener("keydown", handleEscapeKey);

    setMode("comment");

    loadReviewAndComments();
  }

  function setMode(newMode) {
    mode = newMode;

    document.body.style.cursor =
      mode === "comment" ? "crosshair" : "default";
  }

  window.addEventListener("message", function (event) {
    if (event.data && event.data.type === "LESNOISE_MODE") {
      setMode(event.data.mode);
    }
  });

  async function loadReviewAndComments() {
    try {
      const reviewRes = await fetch(
        `${API_URL}/review/${reviewToken}`
      );

      review = await reviewRes.json();

      const commentsRes = await fetch(
        `${API_URL}/api/review_sessions/${review.id}/comments`
      );

      comments = await commentsRes.json();

      renderComments();

      subscribeToReviewSession();

      renderComments();
    } catch (err) {
      console.error(
        "Lesnoise: failed to load review/comments",
        err
      );
    }
  }

  function closeCommentCards() {
    document
      .querySelectorAll(".lesnoise-comment-card")
      .forEach((card) => card.remove());
  }

  function closeCommentForms() {
  document
    .querySelectorAll(".lesnoise-comment-form")
    .forEach((form) => form.remove());
  }

  function handleEscapeKey(e) {
    if (e.key === "Escape") {
      closeCommentCards();

      closeCommentForms();
    }
  }

  function getElementSelector(el) {
    if (!el || el === document.body) return "body";

    if (el.id) return `#${el.id}`;

    const path = [];

    while (
      el &&
      el.nodeType === Node.ELEMENT_NODE &&
      el !== document.body
    ) {
      let selector = el.nodeName.toLowerCase();

      if (
        el.className &&
        typeof el.className === "string"
      ) {
        const className =
          el.className.trim().split(/\s+/)[0];

        if (className) {
          selector += `.${className}`;
        }
      }

      path.unshift(selector);

      el = el.parentElement;
    }

    return path.join(" > ");
  }

  function renderComments() {
    document
      .querySelectorAll(".lesnoise-pin")
      .forEach((pin) => pin.remove());

    comments.forEach((comment, index) => {
      if (
        comment.page_path !==
        window.location.pathname
      ) {
        return;
      }

      const target = document.querySelector(
        comment.element_selector
      );

      if (!target) return;

      const rect = target.getBoundingClientRect();

      const pin = document.createElement("button");

      pin.className = "lesnoise-pin";

      pin.innerText = String(index + 1);

      pin.style.position = "absolute";

      pin.style.left = `${
        window.scrollX +
        rect.left +
        Number(comment.x_element)
      }px`;

      pin.style.top = `${
        window.scrollY +
        rect.top +
        Number(comment.y_element)
      }px`;

      pin.style.transform = "translate(-50%, -50%)";

      pin.style.width = "28px";
      pin.style.height = "28px";

      pin.style.borderRadius = "50%";
      pin.style.border = "none";

      if (comment.author_type === "developer") {
        pin.style.background = "#111827";
      } else {
        pin.style.background = "#2563eb";
      }
      pin.style.color = "white";

      pin.style.fontWeight = "700";

      pin.style.cursor = "pointer";

      pin.style.zIndex = "999998";

      pin.style.boxShadow =
        "0 4px 12px rgba(0,0,0,0.2)";

      pin.addEventListener("click", function (e) {
        e.stopPropagation();

        showCommentCard(comment, pin);
      });

      document.body.appendChild(pin);
    });
  }

function showCommentCard(comment, pin) {
  closeCommentForms();
  document
    .querySelectorAll(".lesnoise-comment-card")
    .forEach((card) => card.remove());

  const rect = pin.getBoundingClientRect();

  const card = document.createElement("div");

  card.className = "lesnoise-comment-card";

  card.innerHTML = `
    <div style="font-weight:700; margin-bottom:6px;">
      ${comment.author_name || "Client"}
    </div>

    <div
      class="lesnoise-comment-body"
      style="font-size:14px; line-height:1.4; margin-bottom:12px;"
    >
      ${comment.body}
    </div>

    <div style="display:flex; gap:8px; justify-content:flex-end;">
      <button data-resolve>
        ${comment.resolved ? "Reopen" : "Resolve"}
      </button>

      <button data-edit>Edit</button>

      <button data-delete>Delete</button>
    </div>
  `;

  card.style.position = "absolute";

  card.style.left = `${
    window.scrollX + rect.left + 36
  }px`;

  card.style.top = `${
    window.scrollY + rect.top - 8
  }px`;

  card.style.width = "240px";

  card.style.background = "white";

  card.style.color = "#111827";

  card.style.border = "1px solid #e5e7eb";

  card.style.borderRadius = "12px";

  card.style.padding = "12px";

  card.style.zIndex = "999999";

  card.style.boxShadow =
    "0 10px 30px rgba(0,0,0,0.2)";

  card.style.fontFamily = "Arial, sans-serif";

  card.querySelector("[data-edit]").addEventListener(
    "click",
    () => {
      const bodyEl = card.querySelector(".lesnoise-comment-body");

      bodyEl.innerHTML = `
        <textarea
          data-edit-body
          style="width:100%; min-height:80px; border:1px solid #d1d5db; border-radius:10px; padding:10px; font-size:14px;"
        >${comment.body}</textarea>

        <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:10px;">
          <button type="button" data-cancel-edit>Cancel</button>
          <button type="button" data-save-edit>Save</button>
        </div>
      `;

      const textarea = bodyEl.querySelector("[data-edit-body]");
      textarea.focus();

      bodyEl
        .querySelector("[data-cancel-edit]")
        .addEventListener("click", () => {
          bodyEl.innerHTML = comment.body;
        });

      bodyEl
        .querySelector("[data-save-edit]")
        .addEventListener("click", async () => {
          const newBody = textarea.value.trim();

          if (!newBody) return;

          try {
            const res = await fetch(
              `${API_URL}/api/review_sessions/${review.id}/comments/${comment.id}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  comment: {
                    body: newBody,
                  },
                }),
              }
            );

            const updatedComment = await res.json();

            comments = comments.map((c) =>
              c.id === comment.id ? updatedComment : c
            );

            renderComments();
            card.remove();
          } catch (err) {
            console.error("Edit failed", err);
          }
        });
    }
  );

  card.querySelector("[data-resolve]").addEventListener(
    "click",
    async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/review_sessions/${review.id}/comments/${comment.id}`,
          {
            method: "PATCH",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              comment: {
                resolved: !comment.resolved,
              },
            }),
          }
        );

        const updatedComment = await res.json();

        comments = comments.map((c) =>
          c.id === comment.id
            ? updatedComment
            : c
        );

        renderComments();

        card.remove();
      } catch (err) {
        console.error("Resolve failed", err);
      }
    }
  );

  card.querySelector("[data-delete]").addEventListener(
    "click",
    async () => {
      try {
        await fetch(
          `${API_URL}/api/review_sessions/${review.id}/comments/${comment.id}`,
          {
            method: "DELETE",
          }
        );

        comments = comments.filter(
          (c) => c.id !== comment.id
        );

        renderComments();

        card.remove();
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  );

  document.body.appendChild(card);
}

  function showCommentForm(clickData) {
    document
      .querySelectorAll(".lesnoise-comment-form")
      .forEach((form) => form.remove());

    const form = document.createElement("form");
    form.className = "lesnoise-comment-form";

    form.innerHTML = `
      <textarea
        name="body"
        placeholder="Write your feedback..."
        style="width:100%; min-height:80px; border:1px solid #d1d5db; border-radius:10px; padding:10px; font-size:14px;"
      ></textarea>

      <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:10px;">
        <button type="button" data-cancel>Cancel</button>
        <button type="submit">Save</button>
      </div>
    `;

    form.style.position = "absolute";
    form.style.left = `${clickData.pageX + 16}px`;
    form.style.top = `${clickData.pageY + 16}px`;
    form.style.width = "260px";
    form.style.background = "white";
    form.style.padding = "14px";
    form.style.borderRadius = "14px";
    form.style.zIndex = "999999";
    form.style.boxShadow = "0 18px 40px rgba(0,0,0,0.25)";
    form.style.fontFamily = "Arial, sans-serif";

    form.querySelector("[data-cancel]").addEventListener("click", () => {
      form.remove();
      setMode("comment");
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const body = form.elements.body.value.trim();
      if (!body) return;

      await saveComment(body, clickData);
      form.remove();
      setMode("comment");
    });

    document.body.appendChild(form);
    form.elements.body.focus();
  }

  async function saveComment(body, clickData) {
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
              author_type: "client",

              page_url: window.location.href,

              page_path:
                window.location.pathname,

              x_percent:
                (clickData.pageX /
                  document.documentElement
                    .scrollWidth) *
                100,

              y_percent:
                (clickData.pageY /
                  document.documentElement
                    .scrollHeight) *
                100,

              x_document:
                clickData.pageX,

              y_document:
                clickData.pageY,

              element_selector:
                clickData.elementSelector,

              x_element:
                clickData.xElement,

              y_element:
                clickData.yElement,

              viewport_width:
                window.innerWidth,

              viewport_height:
                window.innerHeight,
            },
          }),
        }
      );

      const savedComment = await res.json();

      comments = [
        ...comments.filter((c) => c.id !== savedComment.id),
        savedComment,
      ];

      renderComments();

      setMode("comment");
    } catch (err) {
      console.error(
        "Lesnoise: failed to save comment",
        err
      );
    }
  }

async function handlePageClick(e) {
  const clickedInsideLesnoise =
    e.target.closest(".lesnoise-comment-card") ||
    e.target.closest(".lesnoise-pin") ||
    e.target.closest(".lesnoise-comment-form");

  if (!clickedInsideLesnoise) {
    closeCommentCards();
    closeCommentForms();
  }

  if (mode !== "comment") return;

  if (
    e.target.closest(".lesnoise-comment-form") ||
    e.target.closest(".lesnoise-pin") ||
    e.target.closest(".lesnoise-comment-card")
  ) {
    return;
  }

  const interactiveElement = e.target.closest(
    "a, button, input, textarea, select, label, summary"
  );

  if (interactiveElement) {
    return;
  }

  e.preventDefault();
  e.stopPropagation();

  const target = document.elementFromPoint(e.clientX, e.clientY);
  if (!target) return;

  const rect = target.getBoundingClientRect();
  const elementSelector = getElementSelector(target);

  const xElement = e.clientX - rect.left;
  const yElement = e.clientY - rect.top;

  showCommentForm({
    elementSelector,
    xElement,
    yElement,
    pageX: e.pageX,
    pageY: e.pageY,
  });
}

window.addEventListener("resize", renderComments);
window.addEventListener("scroll", renderComments);
window.addEventListener("load", renderComments);

function subscribeToReviewSession() {
  if (!review || cableSocket) return;

  cableIdentifier = JSON.stringify({
    channel: "ReviewSessionChannel",
    review_session_id: review.id,
  });

  cableSocket = new WebSocket(CABLE_URL);

  cableSocket.onopen = function () {
    cableSocket.send(
      JSON.stringify({
        command: "subscribe",
        identifier: cableIdentifier,
      })
    );
  };

  cableSocket.onmessage = function (event) {
    const data = JSON.parse(event.data);

    if (
      data.type === "welcome" ||
      data.type === "ping" ||
      data.type === "confirm_subscription"
    ) {
      return;
    }

    if (!data.message) return;

    handleRealtimeComment(data.message);
  };

  cableSocket.onerror = function (error) {
    console.error("Lesnoise websocket error:", error);
  };

  cableSocket.onclose = function () {
    cableSocket = null;
  };
}

function handleRealtimeComment(event) {
  if (event.action === "created") {
    comments = [
      ...comments.filter((c) => c.id !== event.comment.id),
      event.comment,
    ];
  }

  if (event.action === "updated") {
    comments = comments.map((comment) =>
      comment.id === event.comment.id ? event.comment : comment
    );
  }

  if (event.action === "deleted") {
    comments = comments.filter(
      (comment) => comment.id !== event.comment_id
    );
  }

  renderComments();
}

})();