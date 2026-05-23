import { Link } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  return (
    <main className="markr-home">
      <header className="markr-header">
        <div className="markr-shell markr-header__inner">
          <Link to="/" className="markr-logo">
            Markr
          </Link>

          <nav className="markr-header__nav">
            <Link to="/login" className="markr-header__login">
              Login
            </Link>
            <Link to="/signup" className="markr-header__signup">
              Sign up
            </Link>
          </nav>
        </div>
      </header>

<section className="markr-hero">
  <div className="markr-shell markr-hero__grid">

    {/* LEFT SIDE */}
    <div className="markr-hero__left">
      <p className="markr-hero__eyebrow">Website feedback, refined</p>

      <h1 className="markr-hero__title">
        Feedback,
        <br />
        exactly where
        <br />
        it matters.
      </h1>

      <p className="markr-hero__subtitle">
        Collect precise feedback directly on your pages — in context,
        in place, without friction.
      </p>

      <div className="markr-hero__actions">
        <Link to="/login" className="markr-button markr-button--primary">
          Start a review
        </Link>

        <Link to="/login" className="markr-button markr-button--ghost">
          Login
        </Link>
      </div>
    </div>

    {/* RIGHT SIDE */}
    <div className="markr-hero__right">
      <div className="markr-hero__product">

        <div className="markr-product__glow"></div>

        <div className="markr-product__frame">
          <div className="markr-product__top">
            <div className="dots">
              <span></span><span></span><span></span>
            </div>
            <div className="url">https://project-preview.com</div>
          </div>

          <div className="markr-product__content">
            <h3>A cleaner way to review</h3>
            <p>Clients comment directly on your page.</p>
          </div>

          {/* Pins */}
          <div className="pin pin-1">1</div>
          <div className="pin pin-2">2</div>
          <div className="pin pin-3">3</div>

          {/* Comment */}
          <div className="comment">
            <strong>Client</strong>
            <p>Move this section slightly higher.</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</section>

      <section className="markr-stage">
        <div className="markr-shell">
          <div className="markr-stage__frame">
            <div className="markr-stage__chrome">
              <div className="markr-stage__dots">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="markr-stage__address">https://project-preview.com</div>
            </div>

            <div className="markr-stage__surface">
              <div className="markr-stage__glow"></div>

              <div className="markr-stage__page">
                <div className="markr-stage__badge">Live page</div>

                <h2 className="markr-stage__headline">
                  A cleaner way to review
                  <br />
                  websites in context.
                </h2>

                <p className="markr-stage__copy">
                  Share one review link, let clients click directly on the page,
                  and keep every comment anchored to the right place.
                </p>

                <div className="markr-stage__line"></div>
                <div className="markr-stage__line markr-stage__line--short"></div>

                <div className="markr-stage__mini-card">
                  <span className="markr-stage__mini-label">Section note</span>
                  <p>Increase spacing above this block.</p>
                </div>
              </div>

              <button className="markr-pin markr-pin--one" type="button">
                1
              </button>
              <button className="markr-pin markr-pin--two" type="button">
                2
              </button>
              <button className="markr-pin markr-pin--three" type="button">
                3
              </button>

              <div className="markr-comment-card">
                <div className="markr-comment-card__top">
                  <span className="markr-comment-card__author">Client</span>
                  <span className="markr-comment-card__tag">Comment</span>
                </div>

                <p className="markr-comment-card__body">
                  This headline feels strong. Move the CTA slightly higher so it
                  sits closer to the message.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="markr-value">
        <div className="markr-shell markr-value__inner">
          <p>No screenshots.</p>
          <p>No endless emails.</p>
          <p>No confusion.</p>

          <span className="markr-value__subline">
            Just clear feedback, placed exactly where it belongs.
          </span>
        </div>
      </section>

      <section className="markr-flow">
        <div className="markr-shell">
          <p className="markr-flow__text">
            Create a review. Share the link. Watch feedback appear directly on
            the page.
          </p>
        </div>
      </section>

      <section className="markr-cta">
        <div className="markr-shell">
          <div className="markr-cta__panel">
            <p className="markr-cta__eyebrow">Ready to start</p>

            <h2 className="markr-cta__title">Start your first review.</h2>

            <p className="markr-cta__subtitle">
              A cleaner way to collect feedback — for designers, developers, and
              clients.
            </p>

            <Link to="/login" className="markr-button markr-button--primary">
              Start a review
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}