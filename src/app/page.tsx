import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <div className="nav landing-nav">
        <div className="brand">LearnBot</div>
        <div className="nav-links">
          <Link className="btn primary" href="/signup">Start Learning</Link>
          <Link className="btn" href="/login">Log in</Link>
        </div>
      </div>

      <section className="hero-shell">
        <div className="hero-copy">
          <span className="badge">Adaptive coding platform</span>
          <h1>Learn the next thing. Skip the stuff you already know.</h1>
          <p className="muted">
            Build a guided roadmap that changes based on the concepts you already understand, then move straight into the next lesson that matters.
          </p>
          <div className="hero-actions">
            <Link className="btn primary" href="/signup">Create your path</Link>
            <Link className="btn" href="/login">Continue learning</Link>
          </div>
        </div>

        <div className="hero-panel">
          <div className="hero-stat">
            <span className="hero-label">Roadmap depth</span>
            <strong>10 guided steps</strong>
          </div>
          <div className="hero-stat">
            <span className="hero-label">Personalization</span>
            <strong>Different paths for different learners</strong>
          </div>
          <div className="hero-stat">
            <span className="hero-label">Flow</span>
            <strong>Watch, practice, check in, move forward</strong>
          </div>
        </div>
      </section>
    </div>
  );
}
