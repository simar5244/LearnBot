import Link from "next/link";

export default function QuizPage() {
  return (
    <div className="container">
      <div className="card" style={{ marginTop: 40 }}>
        <h3>Guided Learning Only</h3>
        <p className="muted">Quizzes are tied to each lesson video.</p>
        <Link className="btn primary" href="/learn">Go to Learn</Link>
      </div>
    </div>
  );
}
