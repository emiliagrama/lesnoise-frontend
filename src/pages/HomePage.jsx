import { Link } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  return (
    <main className="lesnoise-home">
      <header className="lesnoise-header">
        <div className="lesnoise-shell lesnoise-header__inner">
          <Link to="/" className="lesnoise-logo">
            lesnoise
          </Link>

          <nav className="lesnoise-header__nav">
            <Link to="/login" className="lesnoise-header__login">
              Login
            </Link>
            <Link to="/signup" className="lesnoise-header__signup">
              Sign up
            </Link>
          </nav>
        </div>
      </header>

<section className="lesnoise-hero">
  <div className="lesnoise-shell lesnoise-hero__grid">

    {/* LEFT SIDE */}
    <div className="lesnoise-hero__left">
      <p className="lesnoise-hero__eyebrow">Website feedback, refined</p>

      <h1 className="lesnoise-hero__title">
        Feedback,
        <br />
        exactly where
        <br />
        it matters.
      </h1>

      <p className="lesnoise-hero__subtitle">
        Collect precise feedback directly on your pages — in context,
        in place, without friction.
      </p>

      <div className="lesnoise-hero__actions">
        <Link to="/login" className="lesnoise-button lesnoise-button--primary">
          Start a review
        </Link>

        <Link to="/login" className="lesnoise-button lesnoise-button--ghost">
          Login
        </Link>
      </div>
    </div>

    {/* RIGHT SIDE */}
    <div className="lesnoise-hero__right">
      <div className="lesnoise-hero__product">

        <div className="lesnoise-product__glow"></div>

        <div className="lesnoise-product__frame">
          <div className="lesnoise-product__top">
            <div className="dots">
              <span></span><span></span><span></span>
            </div>
            <div className="url">https://project-preview.com</div>
          </div>

          <div className="lesnoise-product__content">
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

      <section className="lesnoise-stage">
        <div className="lesnoise-shell">
          <div className="lesnoise-stage__frame">
            <div className="lesnoise-stage__chrome">
              <div className="lesnoise-stage__dots">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="lesnoise-stage__address">https://project-preview.com</div>
            </div>

            <div className="lesnoise-stage__surface">
              <div className="lesnoise-stage__glow"></div>

              <div className="lesnoise-stage__page">
                <div className="lesnoise-stage__badge">Live page</div>

                <h2 className="lesnoise-stage__headline">
                  A cleaner way to review
                  <br />
                  websites in context.
                </h2>

                <p className="lesnoise-stage__copy">
                  Share one review link, let clients click directly on the page,
                  and keep every comment anchored to the right place.
                </p>

                <div className="lesnoise-stage__line"></div>
                <div className="lesnoise-stage__line lesnoise-stage__line--short"></div>

                <div className="lesnoise-stage__mini-card">
                  <span className="lesnoise-stage__mini-label">Section note</span>
                  <p>Increase spacing above this block.</p>
                </div>
              </div>

              <button className="lesnoise-pin lesnoise-pin--one" type="button">
                1
              </button>
              <button className="lesnoise-pin lesnoise-pin--two" type="button">
                2
              </button>
              <button className="lesnoise-pin lesnoise-pin--three" type="button">
                3
              </button>

              <div className="lesnoise-comment-card">
                <div className="lesnoise-comment-card__top">
                  <span className="lesnoise-comment-card__author">Client</span>
                  <span className="lesnoise-comment-card__tag">Comment</span>
                </div>

                <p className="lesnoise-comment-card__body">
                  This headline feels strong. Move the CTA slightly higher so it
                  sits closer to the message.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lesnoise-value">
        <div className="lesnoise-shell lesnoise-value__inner">
          <p>No screenshots.</p>
          <p>No endless emails.</p>
          <p>No confusion.</p>

          <span className="lesnoise-value__subline">
            Just clear feedback, placed exactly where it belongs.
          </span>
        </div>
      </section>

      <section className="lesnoise-flow">
        <div className="lesnoise-shell">
          <p className="lesnoise-flow__text">
            Create a review. Share the link. Watch feedback appear directly on
            the page.
          </p>
        </div>
      </section>

      <section className="lesnoise-cta">
        <div className="lesnoise-shell">
          <div className="lesnoise-cta__panel">
            <p className="lesnoise-cta__eyebrow">Ready to start</p>

            <h2 className="lesnoise-cta__title">Start your first review.</h2>

            <p className="lesnoise-cta__subtitle">
              A cleaner way to collect feedback — for designers, developers, and
              clients.
            </p>

            <Link to="/login" className="lesnoise-button lesnoise-button--primary">
              Start a review
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}