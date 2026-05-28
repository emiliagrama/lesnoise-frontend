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
      <p className="lesnoise-hero__eyebrow">Designed for clear decisions</p>

      <h1 className="lesnoise-hero__title">
        Feedback,
        <br />
        exactly where
        <br />
        it matters.
      </h1>

      <p className="lesnoise-hero__subtitle">
            Create a review. Share the link. Watch comments appear directly on
            the page.
      </p>

      <div className="lesnoise-hero__actions">
        <Link to="/login" className="lesnoise-button lesnoise-button--primary">
          Start a review
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
            <div className="url">https://project-preview.com
            </div>
          </div>

          <div className="lesnoise-product__content">
          <div className="lesnoise-mini-section">
          
            <h3>Systems for modern products</h3>
          </div>
          <button className="lesnoise-button lesnoise-button--ghost">book now</button>
          </div>

          {/* Pins */}
          <div className="pin pin-1">1</div>
          <div className="pin pin-2">2</div>
          <div className="pin pin-3">3</div>

          {/* Comment */}
          <div className="comment">
            <div className="lesnoise-comment-card__top">
              <span className="lesnoise-comment-card__developer">Client</span>
              <span>unresolved</span>
            </div>

            <p>
              Move this CTA slightly higher so it connects faster with the headline.
            </p>
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
                <div className="lesnoise-shell lesnoise-value__inner">
               
                  <p>No screenshots.</p>
                  <p>No endless emails.</p>
                  <p>No confusion.</p>
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
                  <span className="lesnoise-comment-card__developer">Developer</span>
                  <span >solved</span>
                </div>

                <p className="lesnoise-comment-card__body">
                  Updated spacing and aligned the CTA with the hero copy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lesnoise-value">

          <span className="lesnoise-value__subline">
            No noise, no chaos.
          </span>
       
      </section>

      <section className="lesnoise-cta">
        <div className="lesnoise-shell">
          <div className="lesnoise-cta__panel">
            <p className="lesnoise-cta__eyebrow">real connection</p>

            <h2 className="lesnoise-cta__title">Start your first review.</h2>

            <p className="lesnoise-cta__subtitle">
              Built for smoother collaboration between clients and developers.
            </p>

            <Link to="/login" className="lesnoise-button lesnoise-button--ghost">
              Start a review
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}