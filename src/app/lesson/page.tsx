import Link from "next/link";

export default function LessonPage() {
  return (
    <div className="container">
      <div className="card" style={{ marginTop: 40 }}>
        <h3>Guided Learning Only</h3>
        <p className="muted">Lessons are locked until you pass each quiz.</p>
        <Link className="btn primary" href="/learn">Go to Learn</Link>
      </div>
    </div>
  );
}
